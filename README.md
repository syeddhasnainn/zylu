# Zylu - AI Chat Application

A powerful, full-stack AI chat application built with modern web technologies and advanced AI capabilities. Zylu provides a seamless conversational experience with cutting-edge AI models, and intelligent web search integration.

## ✨ Key Features

### 🤖 **Advanced AI Integration**

- **Bring Your Own Key (BYOK)**: Secure integration with OpenRouter using your own API keys
- **Multimodal Support**: Handle text, images, and other media types in conversations

### 🔍 **Intelligent Web Search**

- Real-time web search integration for up-to-date information
- Seamless context integration between search results and AI responses
- Smart source attribution and fact-checking capabilities

### 🔐 **Secure & Scalable**

- Built-in authentication with Convex Auth
- Real-time database with Convex
- Secure API key management
- Scalable architecture for high-performance chat experiences

## 🛠️ Tech Stack

This application is built with a modern, production-ready stack:

- **Backend**: [Convex](https://convex.dev/) - Real-time database and server functions
- **Frontend**: [React](https://react.dev/) + [Next.js](https://nextjs.org/) - Modern web framework
- **Authentication**: [Convex Auth](https://labs.convex.dev/auth) - Secure user authentication
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Beautiful, responsive UI
- **AI Integration**: OpenRouter API with BYOK support
- **Search**: Integrated web search capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- An OpenRouter account (for AI models)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd zylu
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   - `CONVEX_DEPLOYMENT` - Your Convex deployment URL
   - Other required API keys and configuration

4. **Initialize Convex**

   ```bash
   npx convex dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` and start chatting!

## 📖 Usage

### Getting Started with AI Chat

1. **Sign up/Login** - Create an account or sign in with your existing credentials
2. **Configure API Keys** - Add your OpenRouter API key in the settings
3. **Start Chatting** - Begin conversations with advanced AI models
4. **Use Multimodal Features** - Upload images and other media for analysis
5. **Enable Web Search** - Get real-time information integrated into your conversations

### Key Features Guide

#### **Reasoning Models**

- Access to advanced reasoning models for complex problem-solving
- Chain-of-thought reasoning for better explanations
- Context-aware responses that build on previous interactions

#### **Multimodal Capabilities**

- Upload and analyze images, documents, and other media
- Visual understanding and description
- Cross-modal reasoning between text and images

#### **Web Search Integration**

- Real-time web search for current events and facts
- Automatic source attribution
- Seamless integration with AI responses

## 🔧 Configuration

### OpenRouter Integration

Configure your OpenRouter settings in the app:

1. Go to Settings → API Configuration
2. Enter your OpenRouter API key
3. Select your preferred models
4. Configure usage limits and preferences

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
