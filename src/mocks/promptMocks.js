// Mock data for prompt testing
const mockPrompts = [
  {
    id: 'prompt1',
    title: 'AI Image Generation Prompt',
    description: 'A powerful prompt for generating detailed and creative images with AI models.',
    link: 'https://example.com/ai-image-prompt',
    image: '',
    keyword: 'prompt,image,generation',
    tags: ['Image Generation', 'Creative', 'AI Art'],
    category: 'AI Prompts',
    additionalHTML: `
      <h2>How to Use This Prompt</h2>
      <p>Follow these steps to generate amazing images:</p>
      <ol>
        <li>Copy the prompt template below</li>
        <li>Replace the [SUBJECT] with your desired subject</li>
        <li>Adjust other parameters as needed</li>
        <li>Paste into your favorite AI image generator</li>
      </ol>
      
      <h3>Prompt Template</h3>
      <pre class="p-4 bg-gray-100 rounded my-4 overflow-auto">
        [SUBJECT], ultra-detailed, 8k, photorealistic, professional photography, dramatic lighting, vivid colors
      </pre>
      
      <h3>Examples</h3>
      <p>Here are some examples of subjects you can use:</p>
      <ul>
        <li>A majestic eagle soaring over mountains</li>
        <li>A futuristic city with flying cars</li>
        <li>An underwater scene with bioluminescent creatures</li>
      </ul>
    `,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-03-20').toISOString()
  },
  {
    id: 'prompt2',
    title: 'Coding Assistant Prompt',
    description: 'Optimize your coding workflow with this structured prompt for coding assistants.',
    link: 'https://example.com/coding-prompt',
    image: '',
    keyword: 'prompt,coding,assistant',
    tags: ['Coding', 'Programming', 'Productivity'],
    category: 'Coding Assistant',
    additionalHTML: `
      <h2>The Perfect Coding Assistant Prompt</h2>
      <p>When working with AI coding assistants, structure is key. This prompt template will help you get better results:</p>
      
      <h3>Prompt Structure</h3>
      <div class="p-4 border border-blue-200 rounded my-4">
        <p><strong>Task:</strong> [Describe what you want to build]</p>
        <p><strong>Context:</strong> [Provide context about your project]</p>
        <p><strong>Requirements:</strong> [List specific requirements]</p>
        <p><strong>Tech Stack:</strong> [List technologies you're using]</p>
        <p><strong>Constraints:</strong> [Mention any limitations]</p>
      </div>
      
      <h3>Example</h3>
      <div class="p-4 bg-gray-100 rounded my-4">
        <p><strong>Task:</strong> Create a React component for a user profile card</p>
        <p><strong>Context:</strong> Building a social media dashboard</p>
        <p><strong>Requirements:</strong> Display user avatar, name, bio, follower count; Include follow button</p>
        <p><strong>Tech Stack:</strong> React 18, Tailwind CSS</p>
        <p><strong>Constraints:</strong> Must be responsive and accessible</p>
      </div>
    `,
    createdAt: new Date('2025-02-10').toISOString(),
    updatedAt: new Date('2025-04-05').toISOString()
  }
];

export default mockPrompts;
