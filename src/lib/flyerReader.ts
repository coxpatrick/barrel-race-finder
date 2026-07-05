import type { EventSubmission } from '../types'

export async function readFlyer(
  _file: File
): Promise<Partial<EventSubmission>> {
  // Placeholder for AI extraction.
  // Later we'll replace this with an AI service.

  return {
    name: 'AI Demo Race',
    city: 'Arlington',
    state: 'Texas',
    stateCode: 'TX',
    arena: 'Globe Life Field',
    arenaAddress: '734 Stadium Dr',
    addedMoney: 5000,
    entryFee: 60,
    classes: ['Open', 'Youth'],
  }
}