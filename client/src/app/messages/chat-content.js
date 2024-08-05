// components/ChatContent.js
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { useAuth } from "context/auth-provider"
import { useChat } from "context/chat-provider"
import { cn } from "lib/utils"
import { Send } from "lucide-react"
import { forwardRef, useState } from "react"
import ChatMessage from "./chat-message"
import MessageHeader from "./message-header"

const ChatContent = forwardRef(({ onBack, className }, ref) => {
  const { user } = useAuth()

  const { messages, selectedConversation, sendMessage } = useChat()
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    try {
      await sendMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const receiver = selectedConversation?.participants?.[0]

  const isShowSenderInfo = (index) => {
    const msg = messages[index]
    const previousMessage = messages[index - 1]
    return previousMessage?.isUser !== msg.isUser
  }

  return (
    <div id="chat-content-container" className={cn("flex-1", className)}>
      <MessageHeader
        avatar={selectedConversation?.avatar}
        name={receiver?.userFullName}
        onBack={onBack}
      />
      <div
        ref={ref}
        id="content-box"
        className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-220px)] h-[calc(100vh-220px)] relative space-y-2"
      >
        {messages?.map((msg, index) => {
          return (
            <ChatMessage
              key={msg.id}
              isUser={msg.isUser}
              sentAt={msg.sentAt}
              message={msg.messageContent}
              showSenderInfo={isShowSenderInfo(index)}
              senderName={msg.isUser ? user.name : receiver.userFullName}
              avatar={selectedConversation?.avatar}
            />
          )
        })}
      </div>
      <div className="p-4 border-t flex items-center gap-3">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white rounded-lg"
        >
          <Send size={24} />
        </Button>
      </div>
    </div>
  )
})

export default ChatContent
