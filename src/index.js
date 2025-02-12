#!/bin/env node

import fs from "fs/promises";
import { create } from "tar";

const showHelp = () => {
  console.log(`
This program compresses the specified directory into a .tar.gz archive.

Usage:
	log-archive <directory_path>

Arguments:
	<directory_path>   The path to the directory that you want to compress.

Example:
	log-archive /path/to/directory
  `);
};

const getUserInput = async () => {
  try {
    const path = process.argv[2];
    if (!path) {
      showHelp();
      throw new Error("Path wasn't passed!");
    }

    const stats = await fs.stat(path);
    if (!stats.isDirectory()) throw new Error(`${path} is not a directory`);

    return path;
  } catch {
    throw new Error(`Directory does not exist or is inaccessible!`);
  }
};

const getDate = () => {
  const date = new Date();
  return (
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0") +
    "_" +
    date.getHours().toString().padStart(2, "0") +
    date.getMinutes().toString().padStart(2, "0") +
    date.getSeconds().toString().padStart(2, "0")
  );
};

const archive = (input, output) => {
  try {
    create({ gzip: true, file: output }, [input]);
    console.log("Done!");
  } catch (error) {
    throw new Error("Error during compressing: ", err);
  }
};

try {
  const input = await getUserInput();
  const output = `logs_archive_${getDate()}.tar.gz`;
  archive(input, output);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
