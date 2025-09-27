import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import { MessageSquare, Search, Plus, User, Star, Paperclip, Reply, Forward, Trash2, Send } from "lucide-react";
import Button from "../../components/buttons/Button";
import styles from "../../hr/inbox/inbox.module.css";

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "online" | "offline" | "away";
}

interface Message {
  id: string;
  from: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  to: string[];
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  priority: "high" | "normal" | "low";
}

const mockMessages: Message[] = [
  {
    id: "1",
    from: { name: "John Doe", email: "john@company.com", role: "Employee" },
    to: ["hr@company.com"],
    subject: "Leave Approval Needed",
    content: "Please review and approve my leave request for next week.",
    timestamp: "2025-09-26T10:30:00Z",
    isRead: false,
    isStarred: true,
    hasAttachments: false,
    priority: "high",
  },
  {
    id: "2",
    from: { name: "Payroll System", email: "payroll@company.com", role: "System" },
    to: ["hr@company.com"],
    subject: "Payroll Processed",
    content: "Payroll for September has been processed.",
    timestamp: "2025-09-25T16:45:00Z",
    isRead: true,
    isStarred: false,
    hasAttachments: true,
    priority: "normal",
  },
];

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "Employee",
    department: "Engineering",
    status: "online",
  },
  {
    id: "2",
    name: "Payroll System",
    email: "payroll@company.com",
    role: "System",
    department: "Finance",
    status: "offline",
  },
];

const EmployeeInbox: React.FC = () => {
  useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [, setShowCompose] = useState(false);

  const filteredMessages = mockMessages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeFilter) {
      case "unread":
        return matchesSearch && !message.isRead;
      case "starred":
        return matchesSearch && message.isStarred;
      case "important":
        return matchesSearch && message.priority === "high";
      default:
        return matchesSearch;
    }
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
  
      <div className={styles.inboxRoot}>
        {/* Header */}
        <header className={styles.inboxHeader}>
          <div>
            <h1 className={styles.inboxTitle}>Employee Inbox</h1>
            <p className={styles.inboxSubtitle}>Internal communication and messaging</p>
          </div>
          <Button className={styles.composeBtn} onClick={() => setShowCompose(true)}>
            <Plus className="w-4 h-4" />
            Compose
          </Button>
        </header>
        {/* Main Content */}
        <div className={styles.inboxMain}>
          {/* Message List */}
          <div className={styles.messageList}>
            <div className={styles.messageSearch}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.filterBar}>
                {["all", "unread", "starred", "important"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`${styles.filterBtn} ${
                      activeFilter === filter ? styles.filterBtnActive : ""
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.messageListScroll}>
              {filteredMessages.length === 0 ? (
                <div className="p-6 text-gray-500 text-center">No messages found</div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.messageItem} ${
                      selectedMessage?.id === msg.id ? styles.messageItemActive : ""
                    } ${!msg.isRead ? styles.messageUnread : ""}`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className={styles.messageAvatar}>
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageSender}>{msg.from.name}</div>
                      <div className={styles.messageSubject}>{msg.subject}</div>
                      <div className={styles.messageSnippet}>{msg.content}</div>
                      <div className={styles.messageMeta}>
                        {msg.isStarred && <Star className={styles.starred} />}
                        {msg.hasAttachments && <Paperclip className={styles.attachment} />}
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Message Detail */}
          <div className={styles.selectedMessagePanel}>
            {!selectedMessage ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4" />
                <div>Select a message to view</div>
              </div>
            ) : (
              <>
                <div className={styles.selectedMessageHeader}>
                  <div>
                    <div className={styles.selectedMessageTitle}>{selectedMessage.subject}</div>
                    <div className="text-sm text-gray-500">{selectedMessage.from.name}</div>
                  </div>
                  <div className={styles.selectedMessageActions}>
                    <button type="button" title="Star" className="p-2 text-gray-400 hover:text-yellow-500"><Star /></button>
                    <button type="button" title="Reply" className="p-2 text-gray-400 hover:text-blue-600"><Reply /></button>
                    <button type="button" title="Forward" className="p-2 text-gray-400 hover:text-green-600"><Forward /></button>
                    <button type="button" title="Delete" className="p-2 text-gray-400 hover:text-red-600"><Trash2 /></button>
                  </div>
                </div>
                <div className={styles.selectedMessageContent}>
                  <div className="mb-4 text-gray-700">{selectedMessage.content}</div>
                  {selectedMessage.hasAttachments && (
                    <div className="flex items-center gap-2 mt-4">
                      <Paperclip className="text-primary-500" />
                      <span>document.pdf</span>
                    </div>
                  )}
                </div>
                <div className={styles.replyBox}>
                  <textarea className={styles.replyInput} placeholder="Type your reply..." rows={2} />
                  <button className={styles.replySendBtn}>
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
          {/* Contacts Sidebar */}
          <div className={styles.contactsSidebar}>
            <div className={styles.contactsHeader}>Contacts</div>
            <div className="p-4 space-y-3">
              {mockContacts.map((contact) => (
                <div key={contact.id} className={styles.contactItem}>
                  <div className="relative">
                    <div className={styles.contactAvatar}>
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        contact.status === "online"
                          ? "bg-green-500"
                          : contact.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <div className={styles.contactName}>{contact.name}</div>
                    <div className={styles.contactMeta}>
                      {contact.role} • {contact.department}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default EmployeeInbox;