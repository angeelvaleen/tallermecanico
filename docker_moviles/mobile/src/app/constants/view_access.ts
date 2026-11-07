export const VIEW_ACCESS = {
  brands: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  models: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  fuels: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  colors: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  methods: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  services: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  parts: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  },

  vehicles: {
    list: ['Administrator', 'client'],
    detail: ['Administrator', 'client'],
    form: ['Administrator', 'client']
  },

  appointments: {
    list: ['Administrator', 'client'],
    detail: ['Administrator', 'client'],
    form: ['client']
  },

  diagnoses: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator','mechanic','assistant']
  },

  evidences: {
    list: ['Administrator'],
    detail: ['Administrator','client','mechanic','assistant'],
    form: ['Administrator','client','mechanic']
  },

  quotes: {
    list: ['Administrator'],
    detail: ['Administrator','client','mechanic','assistant'],
    form: ['Administrator','mechanic']
  },

  workorders: {
    list: ['Administrator', 'mechanic', 'assistant', 'client'],
    detail: ['Administrator', 'mechanic', 'assistant', 'client'],
    form: ['Administrator', 'mechanic', 'assistant']
  },

  payment: {
    list: ['Administrator', 'client'],
    detail: ['Administrator', 'client'],
    form: ['Administrator', 'client']
  },

  history: {
    list: ['Administrator'],
    detail: ['Administrator'],
    form: ['Administrator']
  }
} as const;