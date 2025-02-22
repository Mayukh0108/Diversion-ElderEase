

let screenReaderActive = false;

function toggleScreenReader() {
    screenReaderActive = !screenReaderActive;
    const screenReaderText = document.getElementById('screen-reader-text');
    
    if (screenReaderActive) {
        document.body.addEventListener('mouseover', handleScreenReader);
        alert('Screen reader activated. Hover over elements to hear them.');
    } else {
        document.body.removeEventListener('mouseover', handleScreenReader);
        screenReaderText.style.display = 'none';
    }
}

function handleScreenReader(e) {
    const screenReaderText = document.getElementById('screen-reader-text');
    if (e.target.textContent.trim()) {
        screenReaderText.textContent = e.target.textContent;
        screenReaderText.style.display = 'block';
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(e.target.textContent);
            window.speechSynthesis.speak(utterance);
        }
    }
}


function startVoiceAssistant() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            alert('Voice assistant is listening...');
        };

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };

        recognition.start();
    } else {
        alert('Voice recognition is not supported in your browser.');
    }
}

function handleVoiceCommand(command) {
    if (command.includes('emergency')) {
        alert('Contacting emergency services and caregivers...');
    } else if (command.includes('medication')) {
        alert('Your next medication is scheduled for 2:00 PM');
    } else {
        alert('Command not recognized. Please try again.');
    }
}


let currentFontSize = 16;
function adjustFontSize(change) {
    currentFontSize = Math.max(12, Math.min(24, currentFontSize + change));
    document.body.style.fontSize = `${currentFontSize}px`;
}

// Language toggle (simplified example)
let currentLanguage = 'en';
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    const translations = {
        en: {
            title: 'Making Elderly Care Simple & Safe',
            subtitle: 'A comprehensive care solution that brings peace of mind to seniors and their loved ones.'
        },
        hi: {
            title: 'बुजुर्गों की देखभाल को सरल और सुरक्षित बनाना',
            subtitle: 'एक व्यापक देखभाल समाधान जो बुजुर्गों और उनके प्रियजनों को मन की शांति प्रदान करता है।'
        }
    };
    
    document.querySelector('.hero h1').textContent = translations[currentLanguage].title;
    document.querySelector('.hero p').textContent = translations[currentLanguage].subtitle;
}



