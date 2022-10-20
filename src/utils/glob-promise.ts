import glob from "glob";
import { promisify } from "util";

export const globPromise = promisify(glob);
