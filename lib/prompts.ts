export interface PromptTemplate {
  name: string;
  description: string;
  template: string; // Using a simple string for now. Could be a function later.
}

export interface Mode {
  name: string;
  description: string;
  templates: PromptTemplate[];
}

export const modes: Record<string, Mode> = {
  image_edit: {
    name: "Image Edit",
    description: "General purpose image editing and manipulation.",
    templates: [
      {
        name: "Add Object",
        description: "Add a new object to the image.",
        template: "Add a {object} to the scene.",
      },
      {
        name: "Remove Object",
        description: "Remove an object from the image.",
        template: "Remove the {object} from the image.",
      },
      {
        name: "Change Style",
        description: "Change the artistic style of the image.",
        template: "Change the style of the image to {style}.",
      },
    ],
  },
  tech_infographics: {
    name: "Tech Infographic",
    description: "Create clean, modern infographics about technology.",
    templates: [
      {
        name: "Cloud Architecture",
        description: "Generate a diagram for cloud services.",
        template: "Create a vector-style infographic diagram of a {cloud_provider} architecture for a {service_type}. Use a clean, minimalist style with icons.",
      },
    ],
  },
  android_ui_sim: {
    name: "Android UI Simulation",
    description: "Generate mockups of Android application screens.",
    templates: [
      {
        name: "Login Screen",
        description: "Create a login screen.",
        template: "Generate a high-fidelity mockup of an Android app login screen for a {app_name} app. Include fields for email and password, a login button, and an option for social login. Use Material Design 3 principles.",
      },
    ],
  },
   windows_ui_sim: {
    name: "Windows UI Simulation",
    description: "Generate mockups of Windows application screens.",
    templates: [
      {
        name: "File Explorer",
        description: "Create a File Explorer window.",
        template: "Generate a high-fidelity mockup of a Windows 11 File Explorer window showing files for a {project_name} project. Use the Fluent Design system.",
      },
    ],
  },
  app_process_sim: {
      name: "App Process Simulation",
      description: "Illustrate a user flow or process.",
      templates: [{
          name: "User Onboarding Flow",
          description: "Create a sequence of screens for user onboarding.",
          template: "Create a 3-step user onboarding flow for a mobile app. Step 1: Welcome screen. Step 2: Profile setup. Step 3: Main dashboard tour. Use simple, clear UI elements."
      }]
  }
};

export const getDefaultPrompt = (modeName: string): string => {
    const mode = modes[modeName];
    return mode?.templates[0]?.template || "A high-resolution photograph of a cat.";
}
