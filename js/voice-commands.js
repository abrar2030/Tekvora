// Voice Commands Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize voice recognition if available
  initVoiceRecognition();
  
  // Initialize voice feedback
  initVoiceFeedback();
});

// Initialize voice recognition
function initVoiceRecognition() {
  const voiceControlBtn = document.getElementById('voice-control-btn');
  const voiceIndicator = document.getElementById('voice-indicator');
  
  if (!voiceControlBtn || !voiceIndicator) return;
  
  let recognition;
  let isListening = false;
  
  // Check if browser supports speech recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      isListening = true;
      voiceIndicator.classList.add('active');
      voiceControlBtn.classList.add('active');
      
      // Provide audio feedback
      speakFeedback('Voice control activated');
    };
    
    recognition.onend = () => {
      isListening = false;
      voiceIndicator.classList.remove('active');
      voiceControlBtn.classList.remove('active');
    };
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      // Display interim results
      document.querySelector('.voice-text').textContent = transcript;
      
      // Process final results
      if (event.results[0].isFinal) {
        processVoiceCommand(transcript.toLowerCase());
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isListening = false;
      voiceIndicator.classList.remove('active');
      voiceControlBtn.classList.remove('active');
      
      // Provide error feedback
      speakFeedback('Voice recognition error. Please try again.');
    };
    
    // Toggle voice recognition
    voiceControlBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
    
    // Add keyboard shortcut (Alt+V) to activate voice control
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'v') {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
        }
      }
    });
    
    // Make voice recognition available globally
    window.startVoiceRecognition = function() {
      if (!isListening) {
        recognition.start();
      }
    };
    
    window.stopVoiceRecognition = function() {
      if (isListening) {
        recognition.stop();
      }
    };
  } else {
    voiceControlBtn.style.display = 'none';
    console.warn('Speech recognition not supported in this browser');
  }
}

// Process voice commands
function processVoiceCommand(command) {
  console.log('Voice command:', command);
  
  // Provide audio feedback for command recognition
  speakFeedback('Processing command');
  
  // Navigation commands
  if (command.includes('go to home') || command.includes('show home')) {
    scrollToSection('home');
    speakFeedback('Navigating to home section');
  } 
  else if (command.includes('go to about') || command.includes('show about')) {
    scrollToSection('about');
    speakFeedback('Navigating to about section');
  } 
  else if (command.includes('go to skills') || command.includes('show skills')) {
    scrollToSection('skills');
    speakFeedback('Navigating to skills section');
  } 
  else if (command.includes('go to experience') || command.includes('show experience')) {
    scrollToSection('experience');
    speakFeedback('Navigating to experience section');
  } 
  else if (command.includes('go to projects') || command.includes('show projects')) {
    scrollToSection('projects');
    speakFeedback('Navigating to projects section');
  } 
  else if (command.includes('go to education') || command.includes('show education')) {
    scrollToSection('education');
    speakFeedback('Navigating to education section');
  } 
  else if (command.includes('go to assistant') || command.includes('show assistant')) {
    scrollToSection('ai-assistant');
    speakFeedback('Navigating to AI assistant section');
  }
  
  // Theme commands
  else if (command.includes('dark mode') || command.includes('switch to dark')) {
    setTheme('dark');
    speakFeedback('Switching to dark mode');
  } 
  else if (command.includes('light mode') || command.includes('switch to light')) {
    setTheme('light');
    speakFeedback('Switching to light mode');
  }
  
  // Interaction commands
  else if (command.includes('scroll down')) {
    window.scrollBy(0, window.innerHeight * 0.7);
    speakFeedback('Scrolling down');
  } 
  else if (command.includes('scroll up')) {
    window.scrollBy(0, -window.innerHeight * 0.7);
    speakFeedback('Scrolling up');
  } 
  else if (command.includes('top') || command.includes('go to top')) {
    window.scrollTo(0, 0);
    speakFeedback('Going to top of page');
  } 
  else if (command.includes('bottom') || command.includes('go to bottom')) {
    window.scrollTo(0, document.body.scrollHeight);
    speakFeedback('Going to bottom of page');
  }
  
  // Project commands
  else if (command.includes('show project') || command.includes('open project')) {
    const projectKeywords = {
      'pay next': 'paynext',
      'payment': 'paynext',
      'finova': 'finovabank',
      'bank': 'finovabank',
      'guardian': 'blockguardian',
      'fraud': 'blockguardian',
      'score': 'blockscore',
      'credit': 'blockscore',
      'carbon': 'carbonxchange',
      'exchange': 'carbonxchange',
      'lend': 'lendsmart',
      'smart': 'lendsmart',
      'micro': 'lendsmart'
    };
    
    let projectId = null;
    
    // Check for project keywords in command
    for (const [keyword, id] of Object.entries(projectKeywords)) {
      if (command.includes(keyword)) {
        projectId = id;
        break;
      }
    }
    
    if (projectId) {
      // Find and click the project details button
      const detailsBtn = document.querySelector(`.project-details-btn[data-project="${projectId}"]`);
      if (detailsBtn) {
        detailsBtn.click();
        speakFeedback(`Opening ${projectId} project details`);
      }
    } else {
      speakFeedback('Project not found. Please specify a project name.');
    }
  }
  
  // Close modal command
  else if (command.includes('close') || command.includes('exit') || command.includes('go back')) {
    const modalClose = document.querySelector('.modal-close');
    if (modalClose && document.querySelector('.project-details-modal.active')) {
      modalClose.click();
      speakFeedback('Closing modal');
    } else {
      speakFeedback('No modal to close');
    }
  }
  
  // AI Assistant commands
  else if (command.includes('ask assistant') || command.includes('question for assistant')) {
    scrollToSection('ai-assistant');
    
    const question = command.replace('ask assistant', '').replace('question for assistant', '').trim();
    if (question) {
      setTimeout(() => {
        askAIAssistant(question);
        speakFeedback('Asking AI assistant your question');
      }, 1000);
    } else {
      speakFeedback('Please specify a question for the AI assistant');
    }
  }
  
  // Help command
  else if (command.includes('help') || command.includes('what can you do') || command.includes('commands')) {
    speakFeedback('Available voice commands include: navigation to sections, switching themes, scrolling, opening projects, and asking the AI assistant questions.');
  }
  
  // Unknown command
  else {
    speakFeedback('Command not recognized. Try saying "help" for available commands.');
  }
}

// Initialize voice feedback
function initVoiceFeedback() {
  // Check if browser supports speech synthesis
  if ('speechSynthesis' in window) {
    // Create speech synthesis instance
    const synth = window.speechSynthesis;
    
    // Make speak function available globally
    window.speakFeedback = function(text) {
      // Cancel any ongoing speech
      synth.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set properties
      utterance.volume = 0.8;
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      
      // Speak
      synth.speak(utterance);
    };
  } else {
    // Fallback if speech synthesis not supported
    window.speakFeedback = function(text) {
      console.log('Voice feedback (not supported):', text);
    };
  }
}

// Scroll to section helper function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const header = document.querySelector('header');
  
  if (section && header) {
    window.scrollTo({
      top: section.offsetTop - header.offsetHeight,
      behavior: 'smooth'
    });
  }
}
