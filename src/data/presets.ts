export interface Preset {
  id: string
  label: string
  prompt: string
  icon: string
}

export const presets: Preset[] = [
  {
    id: 'preset-1',
    label: 'Summarize remote work productivity research',
    prompt: 'Summarize the latest research on remote work productivity, including its impact on output volume and team dynamics.',
    icon: 'BookOpen',
  },
  {
    id: 'preset-2',
    label: 'Compare RAG vs fine-tuning',
    prompt: 'Explain the practical differences between Retrieval-Augmented Generation (RAG) and fine-tuning for adapting an LLM to a specialized domain. Which should a startup use?',
    icon: 'Cpu',
  },
  {
    id: 'preset-3',
    label: 'Evaluate a job offer trade-off',
    prompt: 'I have two job offers. Job A pays 30% more but is at a less stable company. Job B is at a top-tier firm but the role is more junior. Which should I take?',
    icon: 'Scale',
  },
  {
    id: 'preset-4',
    label: 'Critique a product strategy',
    prompt: "Critique the following product strategy: 'We will become the leading AI assistant for healthcare by focusing on superior accuracy and faster responses than competitors.'",
    icon: 'Target',
  },
]
