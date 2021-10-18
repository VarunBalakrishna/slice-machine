import { describe, expect, test, jest, afterEach } from "@jest/globals";
import inquirer from "inquirer";
import {
  maybeExistingRepo,
  promptForRepoName,
  prettyRepoName,
  CREATE_REPO,
  makeReposPretty,
  orderPrompts,
  RepoPrompts,
  RepoPrompt,
  canUpdateCustomTypes,
  maybeStickTheRepoToTheTopOfTheList,
  sortReposForPrompt,
} from "../src/steps/maybe-existing-repo";

import nock from "nock";
import { Communication } from "slicemachine-core";

import * as fs from "fs";

jest.mock("fs");

describe("maybe-existing-repo", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("prompts user to select a repo", async () => {
    const repoName = "test";
    const base = "https://prismic.io";

    jest.spyOn(inquirer, "prompt").mockResolvedValue({ repoName });
    const result = await promptForRepoName(base);

    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(result).toBe(repoName);
  });

  test("if user has no repos it asks them to create a repo", async () => {
    const repoName = "test";
    const base = "https://prismic.io";
    const authUrl = "https://auth.prismic.io";
    const cookies = "prismic-auth=biscuits;";

    nock(authUrl).get("/validate?token=biscuits").reply(200, {
      email: "fake@prismic.io",
      type: "USER",
      repositories: "{}",
    });

    jest.spyOn(inquirer, "prompt").mockResolvedValue({ repoName });

    const result = await maybeExistingRepo(cookies, base);

    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    return expect(result).toEqual(repoName);
  });

  test("it allows a user to create a new repo", async () => {
    const repoName = "test";
    const base = "https://prismic.io";
    const authUrl = "https://auth.prismic.io";
    const cookies = "prismic-auth=biscuits;";

    nock(authUrl)
      .get("/validate?token=biscuits")
      .reply(200, {
        email: "fake@prismic.io",
        type: "USER",
        repositories: JSON.stringify({
          foo: { dbid: "foo", role: Communication.Roles.OWNER },
        }),
      });

    jest
      .spyOn(inquirer, "prompt")
      .mockResolvedValueOnce({ repoName: CREATE_REPO })
      .mockResolvedValueOnce({ repoName });

    const result = await maybeExistingRepo(cookies, base);
    expect(inquirer.prompt).toHaveBeenCalledTimes(2);
    expect(result).toEqual(repoName);
  });
});

describe("prettyRepoName", () => {
  test("should contain the base url, and a placeholder", () => {
    const address = new URL("https://prismic.io");
    const result = prettyRepoName(address);
    expect(result).toContain("repo-name");
    return expect(result).toContain(".prismic.io");
  });

  test("shohuld contain the value from user input", () => {
    const address = new URL("https://prismic.io");
    const result = prettyRepoName(address, "foo-bar");
    expect(result).toContain("foo-bar");
    expect(result).toContain(".prismic.io");
  });
});

describe("canUpdateCutsomTypes", () => {
  test("should return true only if role is owner or admin", () => {
    const roles = Object.values(Communication.Roles);

    roles.forEach((role) => {
      const result = canUpdateCustomTypes(role);
      const wanted =
        role === Communication.Roles.ADMIN ||
        role === Communication.Roles.OWNER;
      return expect(result).toBe(wanted);
    });
  });
});

describe("makeReposPretty", () => {
  test("unauthorized role", () => {
    const base = "https://prismic.io";
    const result = makeReposPretty(base)([
      "foo-bar",
      { role: Communication.Roles.WRITER },
    ]);

    expect(result.name).toContain("https://foo-bar.prismic.io");
    expect(result.value).toBe("foo-bar");
    expect(result.disabled).toContain("Unauthorized");
  });

  test("authorized role", () => {
    const base = "https://prismic.io";
    const result = makeReposPretty(base)([
      "foo-bar",
      { role: Communication.Roles.OWNER },
    ]);

    expect(result.name).toContain("https://foo-bar.prismic.io");
    expect(result.value).toBe("foo-bar");
    expect(result.disabled).toBeUndefined();
  });
});

describe("orderPrompts", () => {
  test("sends disabled repos to end of array", () => {
    const prompts: RepoPrompt[] = [
      { name: "a", value: "a", disabled: "a" },
      { name: "b", value: "b" },
      { name: "c", value: "c", disabled: "c" },
    ];

    const result = prompts.sort(orderPrompts());

    expect(result[0].name).toBe("b");
    expect(result[1].disabled).toBe("a");
    expect(result[2].disabled).toBe("c");
  });

  test("will not more $_CREATE_REPO", () => {
    const prompts: RepoPrompt[] = [
      { name: "a", value: "a" },
      { name: "b", value: CREATE_REPO },
      { name: "c", value: "c" },
    ];

    const result = prompts.sort(orderPrompts());
    expect(result[1].value).toBe(CREATE_REPO);
  });

  test("will not move separator if present", () => {
    const prompts: RepoPrompts = [
      { name: "a", value: "a" },
      new inquirer.Separator(),
      { name: "c", value: "c", disabled: "c" },
    ];

    const result = prompts.sort(orderPrompts());
    expect(result[1]).toBeInstanceOf(inquirer.Separator);
  });

  test("will not move repo name if given", () => {
    const prompts: RepoPrompts = [
      { name: "a", value: "a", disabled: "a" },
      new inquirer.Separator(),
      { name: "c", value: "c", disabled: "c" },
    ];

    const result = prompts.sort(orderPrompts("a"));
    expect(result[0]).toEqual(prompts[0]);
  });
});

describe("maybeStickTheRepoToTheTopOfTheList", () => {
  test("when repo name is not given it should return the prompts in order", () => {
    const prompts: RepoPrompt[] = [
      { name: "a", value: "a" },
      { name: "b", value: "b" },
      { name: "c", value: "c", disabled: "c" },
    ];

    const start = { name: CREATE_REPO, value: CREATE_REPO };

    const result = prompts.reduce(maybeStickTheRepoToTheTopOfTheList(), [
      start,
    ]);

    const [top, a, b, c] = result;
    expect(top).toBe(start);

    expect([a, b, c]).toEqual(prompts);
  });

  test("when no repo name is given and it apears in the prompts it should be first", () => {
    const prompts: RepoPrompt[] = [
      { name: "a", value: "a" },
      { name: "b", value: "b" },
      { name: "c", value: "c", disabled: "c" },
    ];

    const start = { name: CREATE_REPO, value: CREATE_REPO };

    const result = prompts.reduce(maybeStickTheRepoToTheTopOfTheList("b"), [
      start,
    ]);

    const [first, second] = result;
    expect(first).toBe(prompts[1]);
    expect(second).toBe(start);
  });
});

describe("sortReposForPrompt", () => {
  test("sort without pre-configured repo-name", () => {
    const repos: Communication.RepoData = {
      "foo-bar": {
        role: Communication.Roles.WRITER,
        dbid: "foobar",
      },
      qwerty: {
        role: Communication.Roles.ADMIN,
        dbid: "qwerty",
      },
    };

    jest.spyOn(fs, "lstatSync").mockImplementationOnce(() => undefined);

    const [first, second, third] = sortReposForPrompt(
      repos,
      "https://prismic.io",
      __dirname
    ) as RepoPrompt[];

    expect(first.value).toBe(CREATE_REPO);
    expect(second.value).toBe("qwerty");
    expect(third.value).toBe("foo-bar");
  });

  test("sort with pre-configure repo-name", () => {
    const repos: Communication.RepoData = {
      "foo-bar": {
        role: Communication.Roles.OWNER,
        dbid: "foobar",
      },
      qwerty: {
        role: Communication.Roles.ADMIN,
        dbid: "qwerty",
      },
    };

    jest.spyOn(fs, "lstatSync").mockImplementationOnce(() => ({} as fs.Stats));

    jest
      .spyOn(fs, "readFileSync")
      .mockImplementationOnce(() =>
        JSON.stringify({ apiEndpoint: "https://foo-bar.prismic.io/api.v2" })
      );

    const [first, second, third] = sortReposForPrompt(
      repos,
      "https://prismic.io",
      __dirname
    ) as RepoPrompt[];

    expect(first.value).toBe("foo-bar");
    expect(second.value).toBe(CREATE_REPO);
    expect(third.value).toBe("qwerty");
  });
});
