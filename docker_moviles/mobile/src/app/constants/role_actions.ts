export const ROLE_ACTIONS = {
  appointments: {
    create: ['client'],
    update: ['client'],
    accept: ['Administrator'],
    cancel: ['Administrator', 'client'],
  },

  workorders: {
    create: ['Administrator'],
    update: ['Administrator', 'mechanic'],
    addDiagnostic: ['mechanic','assistant'],
    addEvidence: ['mechanic','assistant'],
    addQuote: ['mechanic'],
  },

  vehicles: {
    create: ['client'],
    update: ['client'],  
  },

  quotes: {
    toggleItem: ['client'],
    approve: ['client'],
    reject: ['client']
  },

  profile: {
    create: ['Administrator'],
    update: ['Administrator', 'mechanic', 'assistant', 'client'],
    toggleActive: ['Administrator'],
    changePassword: ['Administrator', 'mechanic', 'assistant', 'client'],
  }
} as const;