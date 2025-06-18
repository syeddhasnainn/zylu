"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Keyboard,
  MessageSquare,
  Key,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const keyboardShortcuts = [
    { key: "Ctrl + K", action: "Quick search" },
    { key: "Ctrl + N", action: "New chat" },
    { key: "Ctrl + /", action: "Toggle sidebar" },
    { key: "Ctrl + Enter", action: "Send message" },
    { key: "Ctrl + Shift + L", action: "Clear conversation" },
    { key: "Escape", action: "Close modal/dialog" },
  ];

  const handleSave = () => {
    localStorage.setItem("openrouter-key", apiKey);
    localStorage.setItem("system-prompt", systemPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey((prev) => !prev);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col p-0">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Settings
            </DialogTitle>
            <DialogDescription>
              Customize your Zylu experience with keyboard shortcuts, system
              prompts, and API configurations.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="shortcuts" className="w-full">
            <div className="sticky top-0 bg-background z-10 pb-4">
              <TabsList className="grid w-full grid-cols-2">
                {/* <TabsTrigger
                  value="shortcuts"
                  className="flex items-center gap-2"
                >
                  <Keyboard className="h-4 w-4" />
                  Shortcuts
                </TabsTrigger> */}
                <TabsTrigger value="prompt" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  System Prompt
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </TabsTrigger>
              </TabsList>
            </div>

            {/* <TabsContent value="shortcuts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                  <CardDescription>
                    Use these shortcuts to navigate Zylo more efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                    >
                      <span className="text-sm">{shortcut.action}</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent> */}

            <TabsContent value="prompt" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Prompt</CardTitle>
                  <CardDescription>
                    Customize the default system prompt that will be used for
                    all new conversations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                      id="system-prompt"
                      placeholder="You are a helpful AI assistant. Please be concise and accurate in your responses..."
                      value={
                        systemPrompt
                      }
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      This prompt will be applied to all new conversations.
                      Leave empty to use the default system prompt.
                    </p>
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    {saved ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save System Prompt
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>OpenRouter API Key</CardTitle>
                  <CardDescription>
                    Configure your OpenRouter API key to access multiple AI
                    models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                    <div className="relative">
                      <Input
                        id="openrouter-key"
                        type={showApiKey ? "text" : "password"}
                        placeholder="sk-or-v1-..."
                        value={
                          apiKey
                        }
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleApiKeyVisibility}
                          className="h-8 w-8 p-0"
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey)}
                          className="h-8 w-8 p-0"
                          disabled={!apiKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{" "}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        openrouter.ai/keys
                      </a>
                    </p>
                  </div>

                  <Button onClick={handleSave} className="w-full">
                    {saved ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save API Key
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
                    <p className="font-medium mb-2">About OpenRouter:</p>
                    <p className="mb-2">
                      OpenRouter provides access to multiple AI models including
                      GPT-4, Claude, Llama, and more through a single API.
                    </p>
                    <p className="font-medium mb-1">Security Note:</p>
                    <p>Your API key is stored locally in the browser.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
