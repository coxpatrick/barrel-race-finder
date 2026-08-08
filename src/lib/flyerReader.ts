import type { EventSubmission } from "../types";

export async function readFlyer(
  _file: File
): Promise<Partial<EventSubmission>> {
  // Flyer AI extraction is not connected yet.
  // Leave fields blank so users can enter accurate event information.

  return {
    name: "",
    city: "",
    state: "",
    stateCode: "",
    arena: "",
    arenaAddress: "",
    addedMoney: undefined,
    entryFee: undefined,
    classes: [],
  };
}