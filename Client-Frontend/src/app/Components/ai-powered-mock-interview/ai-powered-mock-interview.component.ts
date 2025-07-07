import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiAiService } from '../../services/gemini-ai.service';

@Component({
  selector: 'app-ai-powered-mock-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-powered-mock-interview.component.html',
  styleUrl: './ai-powered-mock-interview.component.css'
})
export class AiPoweredMockInterviewComponent implements OnInit {
  prompt: string = '';
  response: string | null = null;
  messages: { text: string, isUser: boolean }[] = [];
  isLoading: boolean = false;
  studentYear: 'final' | 'third' | 'second' = 'final';
  studentProfile = {
    name: localStorage.getItem('studentName') || 'Student',
    branch: localStorage.getItem('studentBranch') || '',
    year: Number(localStorage.getItem('studentYear')) || 2025,
    employeeType: localStorage.getItem('studentEmployeeType') || null
  };

  constructor(private geminiAiService: GeminiAiService) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const diff = +this.studentProfile.year - currentYear;
    this.studentYear = diff <= 0 ? 'final' : diff === 1 ? 'third' : 'second';
    this.loadJotFormAgent();
  }

  getGeminiResponse(): void {
    if (!this.prompt.trim()) {
      this.response = 'Please enter a valid prompt.';
      return;
    }

    this.messages.push({ text: this.prompt, isUser: true });
    this.isLoading = true;

    const inputBranch = this.detectBranchFromPrompt(this.prompt) || this.studentProfile.branch || 'Engineering';

    const userProfileHint = `Student Name: ${this.studentProfile.name}\nBranch: ${inputBranch}\nGraduation Year: ${this.studentProfile.year}\nAcademic Year: ${this.studentYear} year\nPlaced: ${!!this.studentProfile.employeeType ? 'Yes' : 'No'}`;

    const fullPrompt = `The user is preparing for mock interviews. Before answering, analyze their student profile:\n${userProfileHint}\n\nUser Question: ${this.prompt}\n\nRules:\n- If it's a general HR or behavioral question, reply with a natural, student-style paragraph.\n- If it's a technical or role-specific question, give structured, point-wise answer.\n- If it's a reverse prompt (\"you are a student...\"), roleplay and answer like a student.\n- Keep all content plain text. DO NOT use HTML, markdown, or asterisks.`;

    const context = {
      prompt: fullPrompt,
      formattingPreference: 'auto_context_student_mock_interview'
    };

    this.geminiAiService.sendPromptToChatbot(JSON.stringify(context)).subscribe(
      (data) => {
        this.messages.push({ text: data.text, isUser: false });
        this.isLoading = false;
        this.prompt = '';
      },
      (error) => {
        this.response = 'There was an error processing your request.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    );
  }

  private detectBranchFromPrompt(text: string): string | null {
    const match = text.match(/(?:i am|i'm|my name is)?\s?(.*?)(?:student|branch|engineering)/i);
    return match ? match[1].trim().toUpperCase() : null;
  }

  private loadJotFormAgent(): void {
    if (typeof window !== 'undefined' && window.AgentInitializer) {
      window.AgentInitializer.init({
        rootId: "JotformAgent-01976368ba8470d98ba2d36ce32c6465592b",
        formID: "01976368ba8470d98ba2d36ce32c6465592b",
        queryParams: ["skipWelcome=1", "maximizable=1"],
        domain: "https://www.jotform.com",
        isInitialOpen: false,
        isDraggable: false,
        background: "linear-gradient(180deg, #C8CEED 0%, #C8CEED 100%)",
        buttonBackgroundColor: "#0a1551",
        buttonIconColor: "#fff",
        variant: false,
        customizations: {
          greeting: "Yes",
          greetingMessage: "Hi! How can I assist you?",
          pulse: "Yes",
          position: "right"
        }
      });
    }
  }
}
