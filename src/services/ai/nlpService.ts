// src/services/ai/nlpService.ts
import type { Transcript } from '../../types/transcript';
import type { AnalysisResult, ActionItem, TaskTable } from '../../types/analysis';

// Mock function to analyze transcript content
export const mockAnalyzeTranscript = async (transcript: Transcript): Promise<AnalysisResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract potential action items (lines with "action item", "todo", "follow up", etc.)
  const actionItems: ActionItem[] = extractActionItems(transcript.content);
  
  // Extract key decisions (sentences with "decided", "agreed", "conclusion", etc.)
  const keyDecisions = extractKeyDecisions(transcript.content);
  
  // Create summary (in a real app, this would use ML/AI)
  const summary = generateMockSummary(transcript.content);
  
  // Generate task table from action items
  const taskTable = generateTaskTable(actionItems, transcript.content);
  
  return {
    id: `analysis-${Date.now()}`,
    transcriptId: transcript.id,
    summary,
    keyDecisions,
    actionItems,
    taskTable,
    entities: {
      people: extractEntities(transcript.content, 'people'),
      organizations: extractEntities(transcript.content, 'organizations'),
      dates: extractEntities(transcript.content, 'dates'),
      topics: extractEntities(transcript.content, 'topics')
    },
    createdAt: new Date().toISOString()
  };
};

// Generate a structured task table from action items
const generateTaskTable = (actionItems: ActionItem[], content: string): TaskTable => {
  // First extract all participants and names mentioned in the transcript
  const nameMatches = content.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
  const participantMatches = content.match(/Participants:(.+)/i);
  const nameInitialsMap = new Map<string, string>();
  
  // Process participant line if found
  if (participantMatches && participantMatches[1]) {
    const participantsText = participantMatches[1];
    const participantPattern = /([A-Za-z\s]+)\s*\(([A-Z]+)\)/g;
    let match;
    while ((match = participantPattern.exec(participantsText)) !== null) {
      const fullName = match[1].trim();
      const initials = match[2].trim();
      nameInitialsMap.set(initials, fullName);
    }
  }
  
  // Sort action items by assignee
  const sortedItems = [...actionItems].sort((a, b) => {
    return a.assignee.localeCompare(b.assignee);
  });
  
  // Group action items by assignee
  const itemsByAssignee = sortedItems.reduce<Record<string, ActionItem[]>>((acc, item) => {
    const assignee = item.assignee;
    if (!acc[assignee]) {
      acc[assignee] = [];
    }
    acc[assignee].push(item);
    return acc;
  }, {});
  
  const taskTableRows = Object.entries(itemsByAssignee).map(([assignee, items]) => {
    // Find the full name if this is an initial
    let fullName = assignee;
    if (nameInitialsMap.has(assignee)) {
      fullName = nameInitialsMap.get(assignee) || assignee;
    }
    
    // Find all tasks for this assignee
    const tasks = items.map(item => item.task);
    
    // Find the earliest deadline among the items
    const earliestDeadline = items.reduce((earliest, item) => {
      if (!item.dueDate) return earliest;
      if (!earliest) return item.dueDate;
      
      // Simple comparison - in a real app you'd parse these to actual dates
      return item.dueDate < earliest ? item.dueDate : earliest;
    }, '');
    
    // Find the highest priority among the items
    const highestPriority = items.reduce((highest, item) => {
      if (!item.priority) return highest;
      if (!highest) return item.priority;
      const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityValues[item.priority as 'high' | 'medium' | 'low'] > priorityValues[highest as 'high' | 'medium' | 'low'] 
        ? item.priority 
        : highest;
    }, '');
    
    return {
      assignee: fullName,
      tasks,
      assignedDate: new Date().toISOString().split('T')[0], // Today's date as a fallback
      deadline: earliestDeadline || 'Not specified',
      priority: highestPriority || 'medium'
    };
  });
  
  return {
    rows: taskTableRows,
    metadata: {
      totalTasks: sortedItems.length,
      tasksWithDeadlines: sortedItems.filter(item => !!item.dueDate).length,
      highPriorityTasks: sortedItems.filter(item => item.priority === 'high').length,
    }
  };
};

// Enhanced function to extract action items
const extractActionItems = (content: string): ActionItem[] => {
  // Improved patterns for task assignment detection
  const actionItemPatterns = [
    /(\w+)\s+will\s+(.+?)(by|before|on)\s+([A-Za-z0-9\s,]+)/gi,
    /action\s+item\s*(for|to)?\s*([A-Za-z\s]+?):\s*(.+?)$/gim,
    /todo\s*(for|to)?\s*([A-Za-z\s]+?):\s*(.+?)$/gim,
    /follow\s?up\s*(for|to)?\s*([A-Za-z\s]+?):\s*(.+?)$/gim,
    /(\w+),\s+(please|can you)\s+(.+?)(by|before|on)?\s*([A-Za-z0-9\s,]+)?/gi
  ];

  const items: ActionItem[] = [];
  const lines = content.split('\n');
  
  // Extract participant initials for better name matching
  const participantMatches = content.match(/Participants:(.+)/i);
  const nameInitialsMap = new Map<string, string>();
  const initialsNameMap = new Map<string, string>();
  
  if (participantMatches && participantMatches[1]) {
    const participantsText = participantMatches[1];
    const participantPattern = /([A-Za-z\s]+)\s*\(([A-Z]+)\)/g;
    let match;
    while ((match = participantPattern.exec(participantsText)) !== null) {
      const fullName = match[1].trim();
      const initials = match[2].trim();
      nameInitialsMap.set(fullName, initials);
      initialsNameMap.set(initials, fullName);
    }
  }
  
  // Indian name patterns (common Indian first and last names)
  const indianFirstNames = [
    'Raj', 'Amit', 'Vikram', 'Rahul', 'Sanjay', 'Anil', 'Sunil', 'Arun',
    'Vijay', 'Ravi', 'Ajay', 'Deepak', 'Manoj', 'Nitin', 'Rakesh', 'Ramesh',
    'Sachin', 'Vinod', 'Sushil', 'Rajiv', 'Aarav', 'Arjun', 'Krishna', 'Pranav',
    'Vivek', 'Rohan', 'Anand', 'Vishal', 'Ashok', 'Satish', 'Suresh', 'Ganesh',
    'Priya', 'Neha', 'Pooja', 'Asha', 'Sunita', 'Anita', 'Meena', 'Geeta',
    'Shobha', 'Radha', 'Kavita', 'Sita', 'Lakshmi', 'Sarita', 'Kiran', 'Neeta',
    'Anjali', 'Deepika', 'Aishwarya', 'Divya', 'Sneha', 'Swati', 'Shweta', 'Ritu',
    'Akash', 'Ishaan', 'Kabir', 'Dhruv', 'Arnav', 'Sahil', 'Vihaan', 'Aditya'
  ];
  
  const indianLastNames = [
    'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta', 'Joshi', 'Verma', 'Rao',
    'Reddy', 'Shah', 'Mehta', 'Gandhi', 'Nair', 'Desai', 'Iyer', 'Agarwal',
    'Mukherjee', 'Chatterjee', 'Banerjee', 'Das', 'Bose', 'Roy', 'Kapoor', 'Khanna',
    'Malhotra', 'Saxena', 'Bhat', 'Yadav', 'Chopra', 'Choudhary', 'Menon', 'Pillai',
    'Patil', 'Kaur', 'Malik', 'Sinha', 'Sethi', 'Chauhan', 'Trivedi', 'Mathur',
    'Prasad', 'Mehra', 'Chawla', 'Dhar', 'Dutta', 'Tiwari', 'Bhatt', 'Bhattacharya'
  ];
  
  // Used to identify if the speaker is assigning a task
  const speakerTaskAssignmentPatterns = [
    /(\w+):\s*(.*?)(action item for|task for|please|can you|will|should|needs to|have to|assigned to)\s+([A-Za-z\s]+)/i
  ];
  
  const datePatterns = [
    /by\s+(tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|[\d\/]+)/i,
    /(due|deadline|complete by|finish by|submit by)\s+(tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|[\d\/]+)/i,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)?/i,
    /\d{1,2}(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /next\s+(week|month|quarter)/i
  ];
  
  // Scan each line for action items
  lines.forEach((line, lineIndex) => {
    // Check if line likely contains an action item
    if (/action item|todo|follow[ -]?up|will|assign|please|can you|should|need to|have to/i.test(line)) {
      const speakerMatch = line.match(/^(\w+):\s*/);
      const speaker = speakerMatch ? speakerMatch[1] : '';
      const speakerFullName = initialsNameMap.get(speaker) || '';
      
      // Try to extract assignee with improved patterns
      let assignee = 'Unassigned';
      let task = line.replace(/^[^:]*:\s*/, '').trim();
      
      // Pattern 1: Direct assignment format "JS: Action item for [name]: [task]"
      const directAssignmentMatch = line.match(/action\s+item\s+(for|to)\s+([A-Za-z\s]+):\s*(.+?)$/i) || 
                                    line.match(/task\s+(for|to)\s+([A-Za-z\s]+):\s*(.+?)$/i);
      
      if (directAssignmentMatch) {
        assignee = directAssignmentMatch[2].trim();
        task = directAssignmentMatch[3].trim();
      } 
      // Pattern 2: Name mentioned first "[Name], please/can you [task]"
      else if (line.match(/(\w+),\s+(please|can you)/i)) {
        const nameMatch = line.match(/(\w+),\s+(please|can you)/i);
        if (nameMatch) {
          assignee = nameMatch[1].trim();
        }
      }
      // Pattern 3: Try to identify Indian names in the context
      else {
        const words = line.split(/\s+/);
        for (const word of words) {
          const cleanWord = word.replace(/[.,;:!?]$/g, '');
          if (indianFirstNames.includes(cleanWord)) {
            // Look ahead to see if next word is a last name
            const wordIndex = words.indexOf(word);
            if (wordIndex < words.length - 1) {
              const nextWord = words[wordIndex + 1].replace(/[.,;:!?]$/g, '');
              if (indianLastNames.includes(nextWord)) {
                assignee = `${cleanWord} ${nextWord}`;
                break;
              }
            }
            assignee = cleanWord;
            break;
          }
        }
      }
      
      // Convert initials to full name or vice versa as needed
      if (initialsNameMap.has(assignee)) {
        assignee = initialsNameMap.get(assignee) || assignee;
      } else if (nameInitialsMap.has(assignee)) {
        // Keep the full name as assignee
      } else {
        // Check for nearby lines for context about who is being assigned
        for (let i = Math.max(0, lineIndex - 3); i < Math.min(lines.length, lineIndex + 3); i++) {
          if (i === lineIndex) continue;
          
          const contextLine = lines[i];
          for (const initials of initialsNameMap.keys()) {
            if (contextLine.includes(initials + ':') && task.length > 0) {
              // Likely the person being spoken to
              assignee = initialsNameMap.get(initials) || assignee;
              break;
            }
          }
        }
      }
      
      // Try to extract due date with improved patterns
      let dueDate: string | undefined = undefined;
      for (const pattern of datePatterns) {
        const dateMatch = line.match(pattern);
        if (dateMatch) {
          dueDate = dateMatch[1] || dateMatch[2] || dateMatch[0];
          dueDate = dueDate.trim();
          break;
        }
      }
      
      // Determine priority based on language used
      let priority = 'medium';
      if (/urgent|critical|high priority|asap|immediately|right away|crucial/i.test(line)) {
        priority = 'high';
      } else if (/low priority|when you have time|not urgent|can wait|if you have time/i.test(line)) {
        priority = 'low';
      }
      
      // Check if the task is worth adding (has enough context)
      if (task.length > 10) {
        items.push({
          id: `action-${Date.now()}-${items.length}`,
          task,
          assignee,
          dueDate,
          status: 'pending',
          priority: priority as 'low' | 'medium' | 'high'
        });
      }
    }
  });
  
  // If no items were found, parse the transcript more aggressively
  if (items.length === 0) {
    // Look for lines that include phrases like "will", "please", etc.
    lines.forEach(line => {
      const speakerMatch = line.match(/^([A-Z]{2}):\s*/);
      if (speakerMatch) {
        const speaker = speakerMatch[1];
        const content = line.substring(speakerMatch[0].length);
        
        // Check if the speaker is assigning a task to someone
        if (/\b(will|please|should|needs? to|have to|assigned to)\b/i.test(content)) {
          // Look for a name in the content
          let assignee = 'Unassigned';
          
          // Check for initials like TW, JS, etc.
          const initialsMatch = content.match(/\b([A-Z]{2})\b/);
          if (initialsMatch && initialsMatch[1] !== speaker && initialsNameMap.has(initialsMatch[1])) {
            assignee = initialsNameMap.get(initialsMatch[1]) || 'Unassigned';
          } else {
            // Check for indian names
            for (const name of indianFirstNames) {
              if (content.includes(name)) {
                assignee = name;
                // Check if followed by a last name
                const nameIndex = content.indexOf(name) + name.length;
                const afterName = content.substring(nameIndex).trim();
                const nextWord = afterName.split(/\s+/)[0]?.replace(/[.,;:!?]$/g, '');
                
                if (indianLastNames.includes(nextWord)) {
                  assignee = `${name} ${nextWord}`;
                }
                break;
              }
            }
          }
          
          // Extract the task
          let task = content;
          // Extract deadline
          let dueDate: string | undefined = undefined;
          for (const pattern of datePatterns) {
            const dateMatch = content.match(pattern);
            if (dateMatch) {
              dueDate = dateMatch[1] || dateMatch[2] || dateMatch[0];
              dueDate = dueDate.trim();
              break;
            }
          }
          
          // Determine priority
          let priority = 'medium';
          if (/urgent|critical|high priority|asap|immediately|right away|crucial/i.test(content)) {
            priority = 'high';
          } else if (/low priority|when you have time|not urgent|can wait|if you have time/i.test(content)) {
            priority = 'low';
          }
          
          // Only add if it seems like a meaningful task
          if (task.length > 10 && assignee !== 'Unassigned') {
            items.push({
              id: `action-${Date.now()}-${items.length}`,
              task,
              assignee,
              dueDate,
              status: 'pending',
              priority: priority as 'low' | 'medium' | 'high'
            });
          }
        }
      }
    });
  }
  
  // If still no items found, use the test data from the transcript if available
  if (items.length === 0) {
    const transcriptDecisionsMatch = content.match(/decisions for today are:\s*([\s\S]+?)(?:\n\n|\n[A-Z]|$)/i);
    
    if (transcriptDecisionsMatch && transcriptDecisionsMatch[1]) {
      const decisionsText = transcriptDecisionsMatch[1];
      const decisionLines = decisionsText.split('\n');
      
      decisionLines.forEach(line => {
        // Extract items from numbered lists like "1. Tom will fix..."
        const numberedItemMatch = line.match(/\d+\.\s+([A-Za-z\s]+)\s+will\s+(.+?)(?:by|before)\s+(.+?)(?:,|$)/i);
        
        if (numberedItemMatch) {
          const assignee = numberedItemMatch[1].trim();
          const task = numberedItemMatch[2].trim();
          const dueDate = numberedItemMatch[3].trim();
          
          items.push({
            id: `action-${Date.now()}-${items.length}`,
            task,
            assignee,
            dueDate,
            status: 'pending',
            priority: 'medium'
          });
        }
      });
    }
  }
  
  // If still no items were found, generate some mock ones
  if (items.length === 0) {
    return [
      { 
        id: `action-${Date.now()}-1`,
        task: 'Update project documentation with meeting outcomes', 
        assignee: 'Alex', 
        dueDate: 'next Friday',
        status: 'pending',
        priority: 'medium'
      },
      { 
        id: `action-${Date.now()}-2`,
        task: 'Schedule follow-up meeting with stakeholders',
        assignee: 'Sarah',
        status: 'pending',
        priority: 'high'
      },
      { 
        id: `action-${Date.now()}-3`,
        task: 'Review the implementation plan and provide feedback', 
        assignee: 'Michael',
        dueDate: 'next Wednesday',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: `action-${Date.now()}-4`,
        task: 'Complete the API documentation for the new endpoints',
        assignee: 'Raj Patel',
        dueDate: 'Next Monday',
        status: 'pending',
        priority: 'high'
      },
      {
        id: `action-${Date.now()}-5`,
        task: 'Conduct security audit of the authentication service',
        assignee: 'Amit Sharma',
        dueDate: 'next Friday',
        status: 'pending',
        priority: 'low'
      }
    ];
  }
  
  return items;
};

// Mock function to extract key decisions
const extractKeyDecisions = (content: string): string[] => {
  const decisionPatterns = [
    /decided\s+to\s+(.+?)\./gi,
    /agreed\s+to\s+(.+?)\./gi, 
    /conclusion\s*:?\s*(.+?)\./gi,
    /resolution\s*:?\s*(.+?)\./gi
  ];
  
  const decisions: string[] = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Simple extraction for demo purposes
    if (/decided|agreed|concluded|determined|resolved|finalized/i.test(line)) {
      decisions.push(line.trim());
    }
  });
  
  // Look for a decisions summary section
  const transcriptDecisionsMatch = content.match(/decisions for today are:\s*([\s\S]+?)(?:\n\n|\n[A-Z]|$)/i);
  
  if (transcriptDecisionsMatch && transcriptDecisionsMatch[1]) {
    const decisionsText = transcriptDecisionsMatch[1];
    const decisionLines = decisionsText.split('\n');
    
    decisionLines.forEach(line => {
      if (line.trim().length > 0) {
        decisions.push(line.trim());
      }
    });
  }
  
  // If no decisions were found, generate some mock ones
  if (decisions.length === 0) {
    return [
      'Agreed to proceed with the new feature implementation in the next sprint',
      'Decided to postpone the marketing campaign until Q3',
      'Team will adopt the new project management methodology starting next month',
      'Budget for the research phase was approved by all stakeholders'
    ];
  }
  
  return decisions;
};

// Generate a mock summary of the transcript
const generateMockSummary = (content: string): string => {
  // In a real app, this would use NLP/ML to generate a summary
  const contentLength = content.length;
  
  // For demo purposes, just return a portion of the content
  if (contentLength < 200) {
    return content;
  }
  
  // Try to find the meeting purpose/agenda
  const agendaMatch = content.match(/agenda is to (.+?)\./i);
  const purposeIntro = agendaMatch 
    ? `This meeting was held to ${agendaMatch[1]}.` 
    : 'The meeting covered several key topics.';
  
  const firstParagraph = content.split('\n\n')[0] || content.substring(0, 200);
  
  // Try to identify the key topics
  const topicMatches = content.match(/\b(issue|problem|feature|project|implementation|integration)\b/gi) || [];
  const topicsMap = new Map<string, number>();
  
  topicMatches.forEach(match => {
    const topic = match.toLowerCase();
    topicsMap.set(topic, (topicsMap.get(topic) || 0) + 1);
  });
  
  // Get the top 3 topics
  const topTopics = Array.from(topicsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);
  
  const topicsText = topTopics.length > 0 
    ? `Key topics discussed included ${topTopics.join(', ')}.` 
    : '';
  
  return `${purposeIntro} ${topicsText} 
    The team discussed project timelines, resource allocation, and next steps. 
    Several action items were assigned and key decisions were made regarding project direction.`;
};

// Mock function to extract named entities with improved Indian name recognition
const extractEntities = (content: string, entityType: 'people' | 'organizations' | 'dates' | 'topics'): string[] => {
  // In a real app, this would use NER (Named Entity Recognition)
  
  if (entityType === 'people') {
    // Extract people from the participants line
    const participantMatches = content.match(/Participants:(.+)/i);
    const extractedPeople: string[] = [];
    
    if (participantMatches && participantMatches[1]) {
      const participantsText = participantMatches[1];
      const participantPattern = /([A-Za-z\s]+)\s*\(([A-Z]+)\)/g;
      let match;
      while ((match = participantPattern.exec(participantsText)) !== null) {
        extractedPeople.push(match[1].trim());
      }
    }
    
    // Common Indian names to look for in the transcript
    const indianNames = [
      'Raj', 'Amit', 'Vikram', 'Rahul', 'Sanjay', 'Anil', 'Sunil', 
      'Vijay', 'Ravi', 'Ajay', 'Deepak', 'Manoj', 'Nitin', 'Rakesh',
      'Priya', 'Neha', 'Pooja', 'Asha', 'Sunita', 'Anita', 'Meena',
      'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta', 'Joshi', 'Verma'
    ];
    
    // Look for indian names in the content
    indianNames.forEach(name => {
      if (content.includes(name) && !extractedPeople.includes(name) &&
          !extractedPeople.some(p => p.includes(name))) {
        // Check if it's followed by a common Indian surname
        const nameIndex = content.indexOf(name);
        const afterNameText = content.substring(nameIndex + name.length, nameIndex + name.length + 30);
        const surnameMatch = afterNameText.match(/^\s+([A-Z][a-z]+)/);
        
        if (surnameMatch) {
          extractedPeople.push(`${name} ${surnameMatch[1]}`);
        } else {
          extractedPeople.push(name);
        }
      }
    });
    
    return extractedPeople.length > 0 ? extractedPeople : ['Alex Johnson', 'Sarah Smith', 'Michael Chen', 'David Wilson', 'Raj Patel'];
  }
  
  // Return mock data for other entity types
  const mockEntities = {
    organizations: ['Acme Corp', 'TechSolutions', 'Global Innovations', 'DataSystems Inc'],
    dates: ['Next Monday', 'July 15th', 'Q3', 'Next quarter', 'Next Friday', 'Thursday'],
    topics: ['Project Timeline', 'Budget Approval', 'Feature Implementation', 'Marketing Strategy', 'Redis Implementation', 'WebSocket Connections']
  };
  
  return mockEntities[entityType];
};

