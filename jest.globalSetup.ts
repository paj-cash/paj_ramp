// Runs once before Jest forks its test workers.
//
// Node >= 22 ships an experimental Web Storage API. During environment
// teardown jest-environment-node enumerates every global (including
// `localStorage`), which emits a noisy `--localstorage-file` warning. The SDK
// does not use web storage, so disable it for the worker processes. Setting
// NODE_OPTIONS here propagates to the workers that are forked afterwards.
export default async function globalSetup(): Promise<void> {
  const flag = "--no-experimental-webstorage";
  if (!process.env.NODE_OPTIONS?.includes(flag)) {
    process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, flag]
      .filter(Boolean)
      .join(" ");
  }
}
