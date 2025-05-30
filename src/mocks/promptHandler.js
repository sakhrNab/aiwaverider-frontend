/**
 * Prompt API Handler
 * 
 * This module provides mock API endpoints for prompt functionality during development
 */

import { createServer, Response } from 'miragejs';

// Sample prompt data - matches the data structure from our populate script
const samplePrompts = [
  {
    id: 'prompt-001',
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
      <pre style="background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow: auto; margin: 1rem 0;">
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prompt-002',
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
      <div style="padding: 1rem; border: 1px solid #93c5fd; border-radius: 0.5rem; margin: 1rem 0;">
        <p><strong>Task:</strong> [Describe what you want to build]</p>
        <p><strong>Context:</strong> [Provide context about your project]</p>
        <p><strong>Requirements:</strong> [List specific requirements]</p>
        <p><strong>Tech Stack:</strong> [List technologies you're using]</p>
        <p><strong>Constraints:</strong> [Mention any limitations]</p>
      </div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'aNlBYTxPgXlDAKQkyEWP', // Using the ID from the error message
    title: 'Creative Writing Prompt',
    description: 'A versatile template for creative writing prompts that can be used with any AI writing assistant.',
    link: 'https://example.com/writing-prompt',
    image: '',
    keyword: 'prompt,writing,creative',
    tags: ['Writing', 'Creative', 'Storytelling'],
    category: 'Creative Writing',
    additionalHTML: `
      <h2>Creative Writing Prompt Generator</h2>
      <p>Use this framework to get high-quality creative writing from AI:</p>
      
      <h3>Basic Structure</h3>
      <div style="padding: 1rem; border: 1px solid #8b5cf6; border-radius: 0.5rem; margin: 1rem 0; background-color: #f5f3ff;">
        <p>Write a [GENRE] story about [MAIN CHARACTER] who [CENTRAL CONFLICT]. The story should be written in [POV] perspective and [TONE]. Include themes of [THEME 1] and [THEME 2].</p>
      </div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Setup mock API server with the specific routes needed
 */
export function setupMockPromptServer() {
  createServer({
    routes() {
      this.namespace = 'api';
      
      // Get all AI tools with prompt filtering capability
      this.get('/ai-tools', () => {
        return {
          success: true,
          data: samplePrompts
        };
      });
      
      // Get single AI tool by ID
      this.get('/ai-tools/:id', (schema, request) => {
        const id = request.params.id;
        const prompt = samplePrompts.find(p => p.id === id);
        
        if (prompt) {
          return {
            success: true,
            data: prompt
          };
        } else {
          return new Response(404, {}, {
            success: false,
            message: 'Prompt not found'
          });
        }
      });
      
      // Create a new prompt
      this.post('/ai-tools', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const newPrompt = {
          id: `prompt-${Date.now()}`,
          ...attrs,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        samplePrompts.push(newPrompt);
        
        return {
          success: true,
          data: newPrompt
        };
      });
      
      // Update an existing prompt
      this.put('/ai-tools/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const promptIndex = samplePrompts.findIndex(p => p.id === id);
        
        if (promptIndex !== -1) {
          samplePrompts[promptIndex] = {
            ...samplePrompts[promptIndex],
            ...attrs,
            updatedAt: new Date().toISOString()
          };
          
          return {
            success: true,
            data: samplePrompts[promptIndex]
          };
        } else {
          return new Response(404, {}, {
            success: false,
            message: 'Prompt not found'
          });
        }
      });
      
      // Delete a prompt
      this.delete('/ai-tools/:id', (schema, request) => {
        const id = request.params.id;
        const promptIndex = samplePrompts.findIndex(p => p.id === id);
        
        if (promptIndex !== -1) {
          const deletedPrompt = samplePrompts.splice(promptIndex, 1)[0];
          
          return {
            success: true,
            data: deletedPrompt
          };
        } else {
          return new Response(404, {}, {
            success: false,
            message: 'Prompt not found'
          });
        }
      });
      
      // Passthrough all other API requests to the real server
      this.passthrough();
    }
  });
}
