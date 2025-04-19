// AI Assistant Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AI assistant interface
  initAIAssistantInterface();
  
  // Initialize AI model visualization
  initAIModelVisualization();
  
  // Initialize AI data analysis
  initAIDataAnalysis();
});

// Initialize AI Assistant Interface
function initAIAssistantInterface() {
  const chatMessages = document.querySelector('.chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-message');
  const voiceInputButton = document.getElementById('voice-input');
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  
  if (!chatMessages || !userInput || !sendButton) return;
  
  // Add initial greeting with typing effect
  setTimeout(() => {
    addMessageWithTypingEffect('ai', "Hello! I'm your AI assistant. I can help you explore Abrar's skills, experience, and projects. What would you like to know?");
  }, 1000);
  
  // Send message function
  const sendMessage = () => {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    addMessage('user', message);
    
    // Process message and get AI response
    processAIResponse(message);
    
    // Clear input
    userInput.value = '';
  };
  
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Voice input for AI assistant
  if (voiceInputButton) {
    let recognition;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        voiceInputButton.classList.add('active');
        voiceInputButton.innerHTML = '<i class="fas fa-microphone-alt"></i>';
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
      };
      
      recognition.onend = () => {
        voiceInputButton.classList.remove('active');
        voiceInputButton.innerHTML = '<i class="fas fa-microphone"></i>';
        // Send message after voice input ends
        if (userInput.value.trim() !== '') {
          sendMessage();
        }
      };
      
      voiceInputButton.addEventListener('click', () => {
        recognition.start();
      });
    } else {
      voiceInputButton.style.display = 'none';
    }
  }
  
  // Suggestion items
  suggestionItems.forEach(item => {
    item.addEventListener('click', () => {
      const question = item.getAttribute('data-question');
      userInput.value = question;
      sendMessage();
    });
  });
  
  // Make AI assistant function available globally
  window.askAIAssistant = function(question) {
    userInput.value = question;
    sendMessage();
  };
}

// Add message to chat
function addMessage(type, content) {
  const chatMessages = document.querySelector('.chat-messages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  
  const icon = document.createElement('i');
  icon.className = type === 'ai' ? 'fas fa-robot' : 'fas fa-user';
  avatarDiv.appendChild(icon);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const paragraph = document.createElement('p');
  paragraph.textContent = content;
  contentDiv.appendChild(paragraph);
  
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  
  chatMessages.appendChild(messageDiv);
  
  // Add animation
  gsap.from(messageDiv, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  });
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add message with typing effect
function addMessageWithTypingEffect(type, content) {
  const chatMessages = document.querySelector('.chat-messages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  
  const icon = document.createElement('i');
  icon.className = type === 'ai' ? 'fas fa-robot' : 'fas fa-user';
  avatarDiv.appendChild(icon);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const paragraph = document.createElement('p');
  paragraph.textContent = '';
  contentDiv.appendChild(paragraph);
  
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  
  chatMessages.appendChild(messageDiv);
  
  // Add animation
  gsap.from(messageDiv, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  });
  
  // Typing effect
  let i = 0;
  const typingSpeed = 30; // ms per character
  
  function typeWriter() {
    if (i < content.length) {
      paragraph.textContent += content.charAt(i);
      i++;
      setTimeout(typeWriter, typingSpeed);
      
      // Scroll to bottom as typing progresses
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  
  typeWriter();
}

// Process AI response with NLP capabilities
function processAIResponse(message) {
  // Simulate AI thinking with loading indicator
  const chatMessages = document.querySelector('.chat-messages');
  
  const thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'message ai thinking';
  
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  
  const icon = document.createElement('i');
  icon.className = 'fas fa-robot';
  avatarDiv.appendChild(icon);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const thinkingIndicator = document.createElement('div');
  thinkingIndicator.className = 'thinking-indicator';
  thinkingIndicator.innerHTML = '<span></span><span></span><span></span>';
  contentDiv.appendChild(thinkingIndicator);
  
  thinkingDiv.appendChild(avatarDiv);
  thinkingDiv.appendChild(contentDiv);
  
  chatMessages.appendChild(thinkingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Process message with NLP
  setTimeout(() => {
    // Remove thinking indicator
    chatMessages.removeChild(thinkingDiv);
    
    // Generate response based on NLP analysis
    const response = generateAIResponse(message);
    
    // Add AI response with typing effect
    addMessageWithTypingEffect('ai', response);
  }, 1500);
}

// Generate AI response with NLP capabilities
function generateAIResponse(message) {
  // Convert message to lowercase for easier matching
  const msg = message.toLowerCase();
  
  // Extract entities and intents
  const entities = extractEntities(msg);
  const intent = determineIntent(msg);
  
  // Generate response based on intent and entities
  let response;
  
  switch (intent) {
    case 'greeting':
      response = getGreetingResponse();
      break;
    case 'skills_inquiry':
      response = getSkillsResponse(entities);
      break;
    case 'experience_inquiry':
      response = getExperienceResponse(entities);
      break;
    case 'project_inquiry':
      response = getProjectResponse(entities);
      break;
    case 'education_inquiry':
      response = getEducationResponse();
      break;
    case 'certification_inquiry':
      response = getCertificationResponse(entities);
      break;
    case 'contact_inquiry':
      response = getContactResponse();
      break;
    case 'comparison_inquiry':
      response = getComparisonResponse(entities);
      break;
    case 'recommendation_inquiry':
      response = getRecommendationResponse(entities);
      break;
    default:
      response = getDefaultResponse();
  }
  
  return response;
}

// Extract entities from message
function extractEntities(message) {
  const entities = {
    skills: [],
    technologies: [],
    companies: [],
    projects: [],
    certifications: []
  };
  
  // Skills and technologies
  const skillKeywords = [
    'java', 'python', 'javascript', 'typescript', 'c#', 
    'docker', 'kubernetes', 'jenkins', 'terraform', 'aws', 'gcp', 'cloud',
    'spring', 'react', 'node', 'angular', 'django',
    'postgresql', 'mongodb', 'mysql', 'redis', 'database',
    'devops', 'programming', 'development', 'frontend', 'backend', 'full-stack', 'fullstack'
  ];
  
  skillKeywords.forEach(skill => {
    if (message.includes(skill)) {
      entities.skills.push(skill);
    }
  });
  
  // Companies
  const companyKeywords = ['ericsson', 'university', 'eötvös', 'elte'];
  
  companyKeywords.forEach(company => {
    if (message.includes(company)) {
      entities.companies.push(company);
    }
  });
  
  // Projects
  const projectKeywords = [
    'paynext', 'payment', 'finova', 'bank', 'guardian', 'fraud', 
    'score', 'credit', 'carbon', 'exchange', 'lend', 'smart', 'blockchain'
  ];
  
  projectKeywords.forEach(project => {
    if (message.includes(project)) {
      entities.projects.push(project);
    }
  });
  
  // Certifications
  const certificationKeywords = [
    'certification', 'certified', 'google', 'aws', 'hackerrank', 
    'devops', 'terraform', 'kubernetes'
  ];
  
  certificationKeywords.forEach(cert => {
    if (message.includes(cert)) {
      entities.certifications.push(cert);
    }
  });
  
  return entities;
}

// Determine intent from message
function determineIntent(message) {
  // Greeting intent
  if (message.match(/\b(hello|hi|hey|greetings|howdy)\b/)) {
    return 'greeting';
  }
  
  // Skills inquiry
  if (message.match(/\b(skill|expertise|proficiency|know|good at|capable|ability)\b/)) {
    return 'skills_inquiry';
  }
  
  // Experience inquiry
  if (message.match(/\b(experience|work|job|career|position|role|ericsson|company)\b/)) {
    return 'experience_inquiry';
  }
  
  // Project inquiry
  if (message.match(/\b(project|portfolio|application|app|develop|create|build|made)\b/)) {
    return 'project_inquiry';
  }
  
  // Education inquiry
  if (message.match(/\b(education|degree|university|college|school|study|studied|course)\b/)) {
    return 'education_inquiry';
  }
  
  // Certification inquiry
  if (message.match(/\b(certification|certificate|certified|credential|qualify|qualified)\b/)) {
    return 'certification_inquiry';
  }
  
  // Contact inquiry
  if (message.match(/\b(contact|email|phone|reach|hire|connect|get in touch)\b/)) {
    return 'contact_inquiry';
  }
  
  // Comparison inquiry
  if (message.match(/\b(compare|comparison|versus|vs|better|stronger|weaker|difference)\b/)) {
    return 'comparison_inquiry';
  }
  
  // Recommendation inquiry
  if (message.match(/\b(recommend|suggestion|advise|advice|should|best|ideal)\b/)) {
    return 'recommendation_inquiry';
  }
  
  // Default intent
  return 'general_inquiry';
}

// Response generators for different intents
function getGreetingResponse() {
  const greetings = [
    "Hello! I'm Abrar's AI assistant. How can I help you learn more about his skills and experience?",
    "Hi there! I'm here to tell you about Abrar's professional background. What would you like to know?",
    "Greetings! I can provide information about Abrar's skills, projects, and experience. What are you interested in?"
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function getSkillsResponse(entities) {
  if (entities.skills.length > 0) {
    // Specific skill inquiry
    const skill = entities.skills[0];
    
    const skillResponses = {
      'java': "Abrar is an expert in Java development with extensive experience in Spring Boot microservices, concurrent programming, and enterprise applications. He has used Java in several projects including PayNext and FinovaBank.",
      'python': "Abrar is highly proficient in Python, using it for automation, data processing, and backend services. He's applied Python in projects like BlockGuardian for fraud detection using machine learning algorithms.",
      'javascript': "Abrar has advanced JavaScript skills including ES6+, async programming, and frontend frameworks. He's used JavaScript extensively in the frontend of projects like FinovaBank and CarbonXchange.",
      'docker': "Abrar has expert-level Docker skills, using it for containerization of applications and microservices across all his projects. He ensures consistent deployment across development, testing, and production environments.",
      'kubernetes': "Abrar is highly skilled in Kubernetes for container orchestration, automating deployment, scaling, and management of containerized applications. He's implemented K8s in projects like PayNext and FinovaBank.",
      'devops': "Abrar specializes in DevOps practices, implementing CI/CD pipelines, infrastructure as code, and automated testing. His experience at Ericsson focused heavily on cloud-based DevOps pipelines and infrastructure.",
      'cloud': "Abrar has extensive cloud infrastructure experience with both AWS and GCP. He's implemented cloud-native solutions, serverless architectures, and managed infrastructure as code with Terraform."
    };
    
    if (skillResponses[skill]) {
      return skillResponses[skill];
    } else {
      return `Abrar has experience with ${skill} and has applied it in his professional projects. Would you like to know about his other technical skills or specific projects?`;
    }
  } else {
    // General skills inquiry
    return "Abrar's top skills include Java, Python, Docker, Kubernetes, and cloud infrastructure technologies like AWS and GCP. He has expertise in both backend and frontend development, with a focus on DevOps and microservices architecture. His skill set spans across programming languages, cloud platforms, CI/CD tools, and database technologies. Would you like more details about any specific skill area?";
  }
}

function getExperienceResponse(entities) {
  if (entities.companies.includes('ericsson')) {
    return "At Ericsson, Abrar worked as a Software Developer focusing on cloud-based DevOps pipelines and infrastructure from August 2023 to October 2024. He automated cloud deployments using Jenkins, GitHub Actions, and Spinnaker CI/CD pipelines, and managed infrastructure as code with Terraform for scalable cloud environments. He also utilized Docker and Kubernetes for containerization and orchestration, monitored cloud performance using Prometheus and Grafana, and implemented security best practices and observability solutions.";
  } else if (entities.companies.includes('university') || entities.companies.includes('eötvös') || entities.companies.includes('elte')) {
    return "Abrar has been working as a Teaching Assistant at Eötvös Loránd University since February 2025. In this role, he supports students in Python, Operating Systems, and Algorithms & Data Structures, helping with concepts and debugging. He conducts tutorials, reviews assignments, facilitates discussions, and consistently assists instructors with course delivery.";
  } else {
    return "Abrar has professional experience as a Software Developer at Ericsson (Aug 2023 - Oct 2024) where he focused on cloud-based DevOps pipelines and infrastructure. He's also been working as a Teaching Assistant at Eötvös Loránd University since February 2025, supporting students in Python, Operating Systems, and Algorithms & Data Structures. Would you like more details about either of these roles?";
  }
}

function getProjectResponse(entities) {
  if (entities.projects.includes('blockchain')) {
    return "Abrar has worked on several blockchain projects including BlockGuardi
(Content truncated due to size limit. Use line ranges to read in chunks)