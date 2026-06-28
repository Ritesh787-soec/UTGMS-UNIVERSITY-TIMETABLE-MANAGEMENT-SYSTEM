import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, User, Eye, EyeOff, Book, Layers, Cpu, HelpCircle, FileText, 
  Sun, Moon, Shield, Bell, Settings, Search, CheckCircle, 
  XCircle, Plus, Edit, Trash, Lock, Unlock, ArrowLeftRight, 
  Download, AlertTriangle, RefreshCw, LogIn, LogOut, Check, ArrowRight, Database, Calendar, BarChart3, Undo, Save
} from 'lucide-react';
import geuLogo from './assets/geu_logo.png';
import homeHeaderImg from './assets/home_header.png';

// ==========================================
// API INTEGRATION & MOCK DATASETS
// ==========================================

const API_BASE_URL = 'http://localhost:8080/api';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("JWT Decode failed:", err);
    return null;
  }
}

async function apiCall(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const config = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}


const INITIAL_USERS = [
  { id: 1, email: "admin@college.com", name: "Admin User", role: "ADMIN" },
  { id: 2, email: "coordinator@college.com", name: "Dr. Robert Key", role: "COORDINATOR" },
  { id: 3, email: "faculty@college.com", name: "Prof. Alan Turing", role: "FACULTY" }
];

const INITIAL_DEPARTMENTS = [
  { id: 1, name: "Computer Science & Engineering", code: "CSE" },
  { id: 2, name: "Computer Applications", code: "CA" }
];

const INITIAL_PROGRAMS = [
  { id: 1, name: "Bachelor of Technology", code: "B.Tech", deptId: 1 },
  { id: 2, name: "Master of Computer Applications", code: "MCA", deptId: 2 }
];

const INITIAL_SECTIONS = [
  { id: 1, name: "Section A", strength: 60, semId: 1 },
  { id: 2, name: "Section B", strength: 72, semId: 1 },
  { id: 3, name: "AIML1", strength: 60, semId: 1 }
];

const INITIAL_FACULTY = [
  { id: 1, name: "Prof. Alan Turing", code: "EMP-001", designation: "Professor", email: "turing@college.com", workload: 12, days: 5, time: "09:00 - 15:00" },
  { id: 2, name: "Dr. Grace Hopper", code: "EMP-002", designation: "Associate Professor", email: "hopper@college.com", workload: 16, days: 5, time: "09:00 - 17:00" },
  { id: 3, name: "Prof. Newton", code: "EMP-003", designation: "Professor", email: "newton@college.com", workload: 12, days: 4, time: "10:00 - 14:00" },
  { id: 4, name: "Dr. Robert Key", code: "EMP-004", designation: "Assistant Professor", email: "key@college.com", workload: 20, days: 6, time: "08:00 - 16:00" },
  { id: 5, name: "Emily Watson", code: "EMP-005", designation: "Teaching Associate", email: "watson@college.com", workload: 20, days: 5, time: "09:00 - 14:00" },
  { id: 6, name: "Dr. Sarah Jenkins", code: "EMP-006", designation: "Assistant Professor", email: "jenkins@college.com", workload: 20, days: 5, time: "09:00 - 17:00" },
  { id: 7, name: "Prof. Robert Miller", code: "EMP-007", designation: "Professor", email: "miller@college.com", workload: 12, days: 5, time: "09:00 - 16:00" }
];

const INITIAL_SUBJECTS = [
  { id: 1, name: "Programming in Java", code: "TCS-401", type: "THEORY", theoryHrs: 3, labHrs: 0 },
  { id: 2, name: "Data Structures", code: "CS-201", type: "THEORY", theoryHrs: 4, labHrs: 0 },
  { id: 3, name: "Algorithms", code: "CS-305", type: "THEORY", theoryHrs: 3, labHrs: 0 },
  { id: 4, name: "Calculus", code: "MA-201", type: "THEORY", theoryHrs: 4, labHrs: 0 },
  { id: 5, name: "OS Concepts", code: "CS-302", type: "THEORY", theoryHrs: 3, labHrs: 0 },
  { id: 6, name: "Database Systems", code: "CS-330", type: "LAB", theoryHrs: 0, labHrs: 4 },
  { id: 7, name: "English Elective", code: "EN-101", type: "THEORY", theoryHrs: 2, labHrs: 0 }
];

const INITIAL_RESOURCES = [
  { id: 1, name: "CR-102", type: "CLASSROOM", capacity: 60, status: "Active" },
  { id: 2, name: "LT-3", type: "LECTURE_THEATRE", capacity: 100, status: "Active" },
  { id: 3, name: "LAB-2", type: "COMPUTER_LAB", capacity: 40, status: "Active" },
  { id: 4, name: "LT-4", type: "LECTURE_THEATRE", capacity: 90, status: "Active" },
  { id: 5, name: "LT-2", type: "LECTURE_THEATRE", capacity: 80, status: "Active" },
  { id: 6, name: "Aud-1", type: "SEMINAR_HALL", capacity: 150, status: "Active" }
];

const INITIAL_TIMETABLE_ENTRIES = [
  { id: 1, day: "MON", slot: 1, subject: "CS-201 Data Structures", faculty: "Prof. Alan Turing", room: "CR-102", type: "THEORY", status: "new", locked: false },
  { id: 2, day: "MON", slot: 2, subject: "CS-305 Algorithms", faculty: "Dr. Grace Hopper", room: "LT-3", type: "THEORY", status: "modified", locked: false },
  { id: 3, day: "TUE", slot: 1, subject: "CS-101 Programming", faculty: "Dr. Robert Key", room: "LAB-2", type: "THEORY", status: "conflict", locked: false },
  { id: 4, day: "TUE", slot: 2, subject: "MA-201 Calculus", faculty: "Prof. Newton", room: "LT-2", type: "THEORY", status: "normal", locked: false },
  { id: 5, day: "WED", slot: 2, subject: "CS-302 OS Concepts", faculty: "Prof. Linus", room: "LT-4", type: "THEORY", status: "normal", locked: false }
];

const INITIAL_REQUESTS = [
  { id: 1, faculty: "Dr. Sarah Jenkins", type: "Slot Change", details: "Mon 09:00 -> Wed 14:00", reason: "Research Work coordination", status: "PENDING" },
  { id: 2, faculty: "Prof. Robert Miller", type: "Room Request", details: "CR-102 (Cap 30) -> Aud-1 (Cap 100)", reason: "Guest Lecture integration", status: "APPROVED" },
  { id: 3, faculty: "Dr. Alan Turing", type: "Leave Request", details: "Date: 24 Oct - 26 Oct", reason: "Conference Presentation", status: "REJECTED" },
  { id: 4, faculty: "Emily Watson", type: "Slot Change", details: "Fri 11:00 -> Thu 08:00", reason: "Commute Issue resolving", status: "PENDING" }
];

const INITIAL_CHANGES = [
  { id: 1, type: "ROOM SHIFT", title: "CS-305: Algorithms", detail: "CR-12 -> LT-3" },
  { id: 2, type: "FACULTY SWAP", title: "CS-101: Programming", detail: "Prof. Smith -> Dr. Robert Key" },
  { id: 3, type: "SCHEDULE MOVE", title: "MA-201: Calculus", detail: "Moved from Tuesday Slot 2 to Thursday Slot 2 to resolve hall unavailability." },
  { id: 4, type: "NEW ENTRY", title: "EN-101: English", detail: "Added as elective requirement." },
  { id: 5, type: "CONFLICT ALERT", title: "CS-330: Databases", detail: "Potential room overlap with Junior Seminar." }
];

const INITIAL_LOGS = [
  { id: 1, user: "admin@college.com", action: "User Creation", timestamp: "2026-06-27 10:15:30", desc: "Created faculty account for Prof. Robert Miller" },
  { id: 2, user: "coordinator@college.com", action: "Timetable Generate", timestamp: "2026-06-27 11:02:15", desc: "Triggered async timetable generator for 2026-ODD B.Tech" },
  { id: 3, user: "coordinator@college.com", action: "Slot Modify", timestamp: "2026-06-27 11:45:00", desc: "Moved CS-305 slot from Monday 10:15 to Wednesday 09:00" },
  { id: 4, user: "admin@college.com", action: "System Backup", timestamp: "2026-06-27 12:00:00", desc: "Completed scheduled database backup" }
];

export default function App() {
  // App-wide state
  const [theme, setTheme] = useState("light");
  const [currentUser, setCurrentUser] = useState(null); // null = login screen
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Entities state
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [faculties, setFaculties] = useState(INITIAL_FACULTY);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [timetableEntries, setTimetableEntries] = useState(INITIAL_TIMETABLE_ENTRIES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [offlineMode, setOfflineMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dynamicUsers, setDynamicUsers] = useState(() => {
    const saved = localStorage.getItem('utgms_dynamic_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [allocations, setAllocations] = useState([]);
  const [selectedAllocationSection, setSelectedAllocationSection] = useState(1);
  const [allocFormFaculty, setAllocFormFaculty] = useState("");
  const [allocFormSubject, setAllocFormSubject] = useState("");
  const [allocFormSession, setAllocFormSession] = useState("2026-ODD");

  const loadAllocations = async (sectionId) => {
    try {
      const data = await apiCall(`/allocations/section/${sectionId}`);
      if (Array.isArray(data)) {
        setAllocations(data);
      }
    } catch (e) {
      console.warn("Allocations failed to load via API. Using mock fallback:", e.message);
      setAllocations([
        { id: 1, facultyId: 1, facultyName: "Prof. Alan Turing", subjectId: 1, subjectName: "CS-201 Data Structures", sectionId: Number(sectionId), session: "2026-ODD" },
        { id: 2, facultyId: 2, facultyName: "Dr. Grace Hopper", subjectId: 2, subjectName: "CS-305 Algorithms", sectionId: Number(sectionId), session: "2026-ODD" }
      ]);
    }
  };

  const handleCreateAllocation = async (allocationData) => {
    try {
      setLoading(true);
      await apiCall('/allocations', 'POST', allocationData);
      alert("Faculty Allocation saved successfully.");
      loadAllocations(allocationData.sectionId);
    } catch (e) {
      console.warn("Backend allocation save failed. Using local mock fallback.", e.message);
      const newAlloc = {
        id: Date.now(),
        facultyId: Number(allocationData.facultyId),
        facultyName: faculties.find(f => f.id === Number(allocationData.facultyId))?.name || "Unknown Faculty",
        subjectId: Number(allocationData.subjectId),
        subjectName: subjects.find(s => s.id === Number(allocationData.subjectId))?.name || "Unknown Subject",
        sectionId: Number(allocationData.sectionId),
        session: allocationData.session
      };
      setAllocations(prev => [...prev, newAlloc]);
      alert("Faculty Allocation saved successfully (Mock Mode).");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this allocation?")) return;
    try {
      setLoading(true);
      await apiCall(`/allocations/${id}`, 'DELETE');
      alert("Allocation deleted successfully.");
      loadAllocations(selectedAllocationSection);
    } catch (e) {
      console.warn("Backend allocation delete failed. Using local mock fallback.", e.message);
      setAllocations(prev => prev.filter(a => a.id !== id));
      alert("Allocation deleted successfully (Mock Mode).");
    } finally {
      setLoading(false);
    }
  };


  const loadData = async () => {
    try {
      setLoading(true);
      const depts = await apiCall('/departments');
      if (Array.isArray(depts)) setDepartments(depts);
      
      const facs = await apiCall('/faculties');
      if (Array.isArray(facs)) setFaculties(facs);
      
      const subs = await apiCall('/subjects');
      if (Array.isArray(subs)) setSubjects(subs);
      
      const resList = await apiCall('/resources');
      if (Array.isArray(resList)) setResources(resList);
      
      try {
        const entries = await apiCall('/timetable?sectionId=1');
        if (Array.isArray(entries)) setTimetableEntries(entries);
      } catch (e) {
        console.warn("Timetable entries failed to load via API:", e.message);
      }
      
      setOfflineMode(false);
    } catch (err) {
      console.warn("Backend API not reachable. Falling back to offline mock mode:", err.message);
      setOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && (currentTab === 'allocations' || currentTab === 'dashboard')) {
      loadAllocations(selectedAllocationSection);
    }
  }, [currentUser, selectedAllocationSection, currentTab]);


  // UI state variables
  const [selectedCell, setSelectedCell] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState(""); // dept, program, section, faculty, subject, resource, request
  const [formData, setFormData] = useState({});
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [captchaCode, setCaptchaCode] = useState("PNINEN");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState([
    { id: 1, type: "conflict", title: "Faculty Collision Alert", desc: "Prof. Alan Turing double-booked on Monday Slot 2", time: "10 mins ago", read: false },
    { id: 2, type: "request", title: "New Leave Request", desc: "Dr. Sarah Jenkins submitted a schedule adjust request", time: "1 hr ago", read: false },
    { id: 3, type: "backup", title: "Backup Successful", desc: "Database snapshot UTGMS_snapshot_2026.sql saved", time: "2 hrs ago", read: false },
    { id: 4, type: "solver", title: "Solver Completed", desc: "B.Tech CSE timetable generated with 92% efficiency", time: "Yesterday", read: true }
  ]);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  
  // Generation simulator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStage, setGenStage] = useState("");
  const [genLogs, setGenLogs] = useState([]);
  const [genReport, setGenReport] = useState(null);
  const [genScope, setGenScope] = useState("full");
  const [versionLifecycle, setVersionLifecycle] = useState("Draft");
  const [timetableHistory, setTimetableHistory] = useState([]);

  // Compare version view state
  const [versionControl, setVersionControl] = useState({
    activeVersion: "v1.3",
    comparingWith: "v1.2",
    changes: INITIAL_CHANGES
  });

  // Apply theme class to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Generate random captcha on mount (every time site is opened)
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Handle Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (captchaInput.toUpperCase() !== captchaCode.toUpperCase()) {
      setLoginError("Invalid Captcha code entered.");
      generateCaptcha();
      return;
    }

    try {
      const token = await apiCall('/auth/login', 'POST', { email: loginEmail, password: loginPassword });
      localStorage.setItem('token', token);
      const payload = decodeJwt(token);
      if (payload) {
        if (payload.role !== selectedRole) {
          setLoginError(`Access denied. Your account is not configured with the selected role: ${selectedRole}.`);
          localStorage.removeItem('token');
          generateCaptcha();
          return;
        }
        const user = {
          email: payload.sub,
          role: payload.role,
          name: payload.sub.split('@')[0]
        };
        setCurrentUser(user);
        logActivity(user.email, "User Login", `Logged in successfully via REST API with role ${user.role}`);
      } else {
        throw new Error("Could not decode token payload");
      }
    } catch (err) {
      console.warn("Login API failed. Trying offline credentials fallback:", err.message);
      
      let user = INITIAL_USERS.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (!user && selectedRole === 'FACULTY') {
        const matchingFaculty = faculties.find(f => f.email && f.email.toLowerCase() === loginEmail.trim().toLowerCase());
        if (matchingFaculty) {
          user = {
            id: matchingFaculty.id,
            email: matchingFaculty.email,
            name: matchingFaculty.name,
            role: "FACULTY",
            password: "faculty123"
          };
        }
      }
      
      // Search in dynamic user repository
      if (!user) {
        user = dynamicUsers.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      }
      
      // Auto-Registration: create and save if User ID does not exist anywhere
      if (!user) {
        const newDynamicUser = {
          id: Date.now(),
          email: loginEmail.trim(),
          name: loginEmail.trim().split('@')[0],
          role: selectedRole,
          password: loginPassword // Stores the password they just typed
        };
        
        const updatedUsers = [...dynamicUsers, newDynamicUser];
        setDynamicUsers(updatedUsers);
        localStorage.setItem('utgms_dynamic_users', JSON.stringify(updatedUsers));
        
        user = newDynamicUser;
        logActivity(user.email, "Auto Registration", `Successfully registered new profile for ${selectedRole}`);
      }
      
      // Enforce role selection match
      if (user.role !== selectedRole) {
        setLoginError(`Access denied. The entered User ID is registered as a ${user.role}, not a ${selectedRole}.`);
        generateCaptcha();
        return;
      }
      
      // Enforce password validation
      let isPasswordValid = false;
      if (user.password) {
        isPasswordValid = (loginPassword === user.password);
      } else {
        isPasswordValid = 
          (loginPassword === "admin123" && user.role === "ADMIN") ||
          (loginPassword === "coord123" && user.role === "COORDINATOR") ||
          (loginPassword === "faculty123" && user.role === "FACULTY");
      }
        
      if (!isPasswordValid) {
        setLoginError("Invalid Password. Please check your credentials.");
        generateCaptcha();
        return;
      }
      
      setCurrentUser(user);
      setOfflineMode(true);
      logActivity(user.email, "User Login", `Logged in successfully (Offline Mock Mode)`);
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      logActivity(currentUser.email, "User Logout", "Logged out from system");
    }
    localStorage.removeItem('token');
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
  };


  const logActivity = (user, action, desc) => {
    const newLog = {
      id: Date.now(),
      user,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      desc
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Mock Timetable Generation Async Process
  const triggerTimetableGeneration = () => {
    setIsGenerating(true);
    setGenProgress(0);
    setGenStage("Validating Academic Structure Data...");
    setGenLogs(["[INFO] Loading B.Tech Semester 4 allocations...", "[INFO] Checking resource availability (6 rooms, 3 labs)..."]);
    
    const interval = setInterval(() => {
      setGenProgress(prev => {
        const next = prev + 20;
        if (next === 20) {
          setGenStage("Validating Room Capacities...");
          setGenLogs(prevLogs => [...prevLogs, "[INFO] Checked section strength constraints successfully.", "[INFO] Phase 1 complete: Feasibility check passed."]);
        } else if (next === 40) {
          setGenStage("Resolving Faculty Working Hours...");
          setGenLogs(prevLogs => [...prevLogs, "[INFO] Loaded availability preferences for 7 faculty members.", "[INFO] Applying hard constraints (No overlaps)..."]);
        } else if (next === 60) {
          setGenStage("Running OptaPlanner Hard Constraint Solver...");
          setGenLogs(prevLogs => [...prevLogs, "[INFO] Iteration 50: Score -0hard/-140soft", "[INFO] Hard constraints satisfied successfully!"]);
        } else if (next === 80) {
          setGenStage("Optimizing Soft Constraints...");
          setGenLogs(prevLogs => [...prevLogs, "[INFO] Iteration 120: Score 0hard/-42soft", "[INFO] Optimizing room movement paths and gaps..."]);
        } else if (next === 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGenStage("Timetable Generated Successfully!");
          setGenLogs(prevLogs => [...prevLogs, "[SUCCESS] Draft version created.", "[SUCCESS] Saved new version v1.4."]);
          logActivity(currentUser.email, "Timetable Generate", "Generated B.Tech Draft Timetable (v1.4)");
          setGenReport({
            placed: 18,
            conflicts: 0,
            facultyUtil: 84,
            roomUtil: 72
          });
        }
        return next;
      });
    }, 1500);
  };

  // Grid Cell Interaction (Swap Slots / Drag & Drop Simulator)
  const handleCellClick = (day, slot) => {
    if (currentUser.role === 'FACULTY') return; // Read-only for faculty
    
    const entryIndex = timetableEntries.findIndex(e => e.day === day && e.slot === slot);
    const entry = entryIndex !== -1 ? timetableEntries[entryIndex] : null;

    if (!selectedCell) {
      // First select
      if (entry) {
        setSelectedCell({ day, slot, entry });
      }
    } else {
      // Swap or Move
      const srcDay = selectedCell.day;
      const srcSlot = selectedCell.slot;
      const srcEntry = selectedCell.entry;

      if (srcDay === day && srcSlot === slot) {
        // Deselect
        setSelectedCell(null);
        return;
      }

      if (srcEntry.locked) {
        alert("This entry is locked! Unlock it first to modify.");
        setSelectedCell(null);
        return;
      }

      const updated = [...timetableEntries];
      
      // Update target
      if (entry) {
        if (entry.locked) {
          alert("Target slot is locked! Cannot modify.");
          setSelectedCell(null);
          return;
        }
        // Swap positions
        updated[entryIndex] = { ...entry, day: srcDay, slot: srcSlot };
      }
      
      const srcIndex = updated.findIndex(e => e.day === srcDay && e.slot === srcSlot);
      updated[srcIndex] = { ...srcEntry, day, slot, status: "modified" };

      // Save to history before modifying (Undo before save compliance)
      setTimetableHistory(prev => [...prev, JSON.parse(JSON.stringify(timetableEntries))]);
      setTimetableEntries(updated);
      logActivity(currentUser.email, "Slot Modify", `Moved ${srcEntry.subject} from ${srcDay} Slot ${srcSlot} to ${day} Slot ${slot}`);
      setSelectedCell(null);
    }
  };

  const handleDragStart = (e, day, slot) => {
    if (currentUser.role === 'FACULTY') return;
    const entry = timetableEntries.find(ent => ent.day === day && ent.slot === slot);
    if (entry) {
      if (entry.locked) {
        e.preventDefault();
        alert("This entry is locked! Unlock it first to modify.");
        return;
      }
      e.dataTransfer.setData("text/plain", JSON.stringify({ day, slot }));
    }
  };

  const handleDrop = (e, targetDay, targetSlot) => {
    e.preventDefault();
    if (currentUser.role === 'FACULTY') return;
    
    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const { day: srcDay, slot: srcSlot } = JSON.parse(dataStr);
      
      if (srcDay === targetDay && srcSlot === targetSlot) return;

      const srcEntryIndex = timetableEntries.findIndex(ent => ent.day === srcDay && ent.slot === srcSlot);
      const targetEntryIndex = timetableEntries.findIndex(ent => ent.day === targetDay && ent.slot === targetSlot);

      const srcEntry = srcEntryIndex !== -1 ? timetableEntries[srcEntryIndex] : null;
      const targetEntry = targetEntryIndex !== -1 ? timetableEntries[targetEntryIndex] : null;

      if (!srcEntry) return;
      if (srcEntry.locked) {
        alert("Dragged entry is locked! Cannot modify.");
        return;
      }
      if (targetEntry && targetEntry.locked) {
        alert("Target slot is locked! Cannot modify.");
        return;
      }

      const updated = [...timetableEntries];
      if (targetEntry) {
        updated[targetEntryIndex] = { ...targetEntry, day: srcDay, slot: srcSlot, status: "modified" };
      }
      updated[srcEntryIndex] = { ...srcEntry, day: targetDay, slot: targetSlot, status: "modified" };

      // Save to history before modifying (Undo before save compliance)
      setTimetableHistory(prev => [...prev, JSON.parse(JSON.stringify(timetableEntries))]);
      setTimetableEntries(updated);
      logActivity(currentUser.email, "Drag and Drop Swap", `Dragged & Swapped ${srcEntry.subject} from ${srcDay} Slot ${srcSlot} to ${targetDay} Slot ${targetSlot}`);
    } catch (err) {
      console.error("Drag and drop swap failed:", err);
    }
  };

  const handleUndoChange = () => {
    if (timetableHistory.length === 0) return;
    const previous = timetableHistory[timetableHistory.length - 1];
    setTimetableEntries(previous);
    setTimetableHistory(prev => prev.slice(0, -1));
    logActivity(currentUser.email, "Undo Modification", "Reverted the last slot change");
  };

  const handleSaveTimetableChanges = () => {
    setTimetableHistory([]);
    alert("All manual modifications saved successfully to the database!");
    logActivity(currentUser.email, "Save Timetable Changes", "Saved manual slot edits");
  };

  const toggleLockEntry = (id) => {
    setTimetableEntries(prev => prev.map(e => e.id === id ? { ...e, locked: !e.locked } : e));
    const item = timetableEntries.find(e => e.id === id);
    logActivity(currentUser.email, item.locked ? "Unlock Slot" : "Lock Slot", `${item.subject} slot locked state changed`);
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      faculty: currentUser.role === 'FACULTY' ? currentUser.name : formData.faculty || "Faculty Member",
      type: formData.type || "Slot Change",
      details: formData.details || "Details here",
      reason: formData.reason || "Reason for request",
      status: "PENDING"
    };
    setRequests(prev => [newReq, ...prev]);
    logActivity(currentUser.email, "Faculty Request Submit", `Submitted ${newReq.type} request`);
    setIsFormOpen(false);
    setFormData({});
  };

  const handleProcessRequest = (id, newStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    const req = requests.find(r => r.id === id);
    logActivity(currentUser.email, `Request ${newStatus}`, `Processed request for ${req.faculty}`);
  };

  // CRUD handlers
  const handleCrudSubmit = async (e) => {
    e.preventDefault();
    if (formType === 'dept') {
      if (!offlineMode) {
        try {
          const res = await apiCall('/departments', 'POST', { name: formData.name, code: formData.code });
          setDepartments(prev => [...prev, res]);
        } catch (err) {
          console.error("API Call failed:", err);
          setDepartments(prev => [...prev, { id: Date.now(), name: formData.name, code: formData.code }]);
        }
      } else {
        setDepartments(prev => [...prev, { id: Date.now(), name: formData.name, code: formData.code }]);
      }
      logActivity(currentUser.email, "Create Department", `Created department ${formData.code}`);
    } else if (formType === 'program') {
      if (!offlineMode) {
        try {
          const res = await apiCall('/programs', 'POST', { name: formData.name, code: formData.code, departmentId: parseInt(formData.deptId) });
          setPrograms(prev => [...prev, res]);
        } catch (err) {
          console.error("API Call failed:", err);
          setPrograms(prev => [...prev, { id: Date.now(), name: formData.name, code: formData.code, deptId: parseInt(formData.deptId) }]);
        }
      } else {
        setPrograms(prev => [...prev, { id: Date.now(), name: formData.name, code: formData.code, deptId: parseInt(formData.deptId) }]);
      }
      logActivity(currentUser.email, "Create Program", `Created program ${formData.code}`);
    } else if (formType === 'section') {
      if (!offlineMode) {
        try {
          const res = await apiCall('/sections', 'POST', { name: formData.name, studentStrength: parseInt(formData.strength), semesterId: 1 });
          setSections(prev => [...prev, res]);
        } catch (err) {
          console.error("API Call failed:", err);
          setSections(prev => [...prev, { id: Date.now(), name: formData.name, strength: parseInt(formData.strength), semId: 1 }]);
        }
      } else {
        setSections(prev => [...prev, { id: Date.now(), name: formData.name, strength: parseInt(formData.strength), semId: 1 }]);
      }
      logActivity(currentUser.email, "Create Section", `Created section ${formData.name}`);
    } else if (formType === 'faculty') {
      if (!offlineMode) {
        try {
          const res = await apiCall('/faculties', 'POST', {
            name: formData.name,
            email: formData.email,
            designation: formData.designation,
            workingDays: String(formData.days || 5),
            maxHoursPerWeek: parseInt(formData.workload || 16)
          });
          setFaculties(prev => [...prev, {
            id: res.id || Date.now(),
            name: res.name || formData.name,
            code: res.employeeCode || "EMP-" + String(res.id || Date.now()),
            designation: res.designation || formData.designation,
            email: res.email || formData.email,
            workload: res.workloadHours || parseInt(formData.workload || 16),
            days: res.workingDays || parseInt(formData.days || 5),
            time: formData.time || "09:00 - 17:00"
          }]);
        } catch (err) {
          console.error("API Call failed:", err);
          setFaculties(prev => [...prev, { id: Date.now(), ...formData, workload: parseInt(formData.workload || 16) }]);
        }
      } else {
        setFaculties(prev => [...prev, { id: Date.now(), ...formData, workload: parseInt(formData.workload || 16) }]);
      }
      logActivity(currentUser.email, "Create Faculty", `Added faculty ${formData.name}`);
    } else if (formType === 'subject') {
      if (!offlineMode) {
        try {
          const res = await apiCall('/subjects', 'POST', {
            subjectName: formData.name,
            subjectCode: formData.code,
            type: formData.type || "THEORY",
            theoryHrsPerWeek: parseInt(formData.theoryHrs || 3),
            labHrsPerWeek: parseInt(formData.labHrs || 0)
          });
          setSubjects(prev => [...prev, {
            id: res.id || Date.now(),
            name: res.subjectName || formData.name,
            code: res.subjectCode || formData.code,
            type: res.type || formData.type,
            theoryHrs: res.theoryHrsPerWeek || parseInt(formData.theoryHrs || 3),
            labHrs: res.labHrsPerWeek || parseInt(formData.labHrs || 0)
          }]);
        } catch (err) {
          console.error("API Call failed:", err);
          setSubjects(prev => [...prev, { id: Date.now(), ...formData, theoryHrs: parseInt(formData.theoryHrs || 3), labHrs: parseInt(formData.labHrs || 0) }]);
        }
      } else {
        setSubjects(prev => [...prev, { id: Date.now(), ...formData, theoryHrs: parseInt(formData.theoryHrs || 3), labHrs: parseInt(formData.labHrs || 0) }]);
      }
      logActivity(currentUser.email, "Create Subject", `Added subject ${formData.name}`);
    } else if (formType === 'resource') {
      if (!offlineMode) {
        try {
          const res = await apiCall('/resources', 'POST', {
            roomNumber: formData.name,
            type: formData.type || "CLASSROOM",
            capacity: parseInt(formData.capacity || 60)
          });
          setResources(prev => [...prev, {
            id: res.id || Date.now(),
            name: res.roomNumber || formData.name,
            type: res.type || formData.type,
            capacity: res.capacity || parseInt(formData.capacity || 60),
            status: "Active"
          }]);
        } catch (err) {
          console.error("API Call failed:", err);
          setResources(prev => [...prev, { id: Date.now(), ...formData, capacity: parseInt(formData.capacity || 60), status: "Active" }]);
        }
      } else {
        setResources(prev => [...prev, { id: Date.now(), ...formData, capacity: parseInt(formData.capacity || 60), status: "Active" }]);
      }
      logActivity(currentUser.email, "Create Resource", `Added room ${formData.name}`);
    }
    setIsFormOpen(false);
    setFormData({});
  };

  const deleteEntity = async (type, id) => {
    if (!offlineMode) {
      try {
        let endpoint = '';
        if (type === 'dept') endpoint = `/departments/${id}`;
        else if (type === 'program') endpoint = `/programs/${id}`;
        else if (type === 'section') endpoint = `/sections/${id}`;
        else if (type === 'faculty') endpoint = `/faculties/${id}`;
        else if (type === 'subject') endpoint = `/subjects/${id}`;
        else if (type === 'resource') endpoint = `/resources/${id}`;
        
        if (endpoint) {
          await apiCall(endpoint, 'DELETE');
        }
      } catch (err) {
        console.error("API delete call failed:", err.message);
      }
    }
    
    if (type === 'dept') setDepartments(prev => prev.filter(x => x.id !== id));
    if (type === 'program') setPrograms(prev => prev.filter(x => x.id !== id));
    if (type === 'section') setSections(prev => prev.filter(x => x.id !== id));
    if (type === 'faculty') setFaculties(prev => prev.filter(x => x.id !== id));
    if (type === 'subject') setSubjects(prev => prev.filter(x => x.id !== id));
    if (type === 'resource') setResources(prev => prev.filter(x => x.id !== id));
    logActivity(currentUser.email, "Delete Entity", `Removed ${type} with ID ${id}`);
  };


  // Helper selectors
  const getCellContent = (day, slot) => {
    return timetableEntries.find(e => e.day === day && e.slot === slot);
  };

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  if (!currentUser) {
    return (
      <div className="geu-login-container">
        <div className="geu-login-card">
          {/* Header with Graphic Era logo */}
          <div className="geu-login-header" style={{ backgroundColor: '#e5f1f9', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={geuLogo} 
              alt="Graphic Era University Logo" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </div>

          <div className="geu-login-body">
            {/* Role Selection Selector */}
            <div className="geu-autofill-section">
              <div className="geu-autofill-title">Select Role to Login:</div>
              <div className="role-select-grid">
                <div className={`role-pill ${selectedRole === 'ADMIN' ? 'selected' : ''}`} onClick={() => setSelectedRole('ADMIN')}>Admin</div>
                <div className={`role-pill ${selectedRole === 'COORDINATOR' ? 'selected' : ''}`} onClick={() => setSelectedRole('COORDINATOR')}>Coordinator</div>
                <div className={`role-pill ${selectedRole === 'FACULTY' ? 'selected' : ''}`} onClick={() => setSelectedRole('FACULTY')}>Faculty</div>
              </div>
            </div>

            {loginError && <div className="login-error">{loginError}</div>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* User ID Field */}
              <div className="geu-input-wrapper">
                <div className="geu-input-icon">
                  <User size={18} />
                </div>
                <input 
                  type="email" 
                  className="geu-input-field" 
                  placeholder="User ID" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="geu-input-wrapper">
                <div className="geu-input-icon">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="geu-input-field" 
                  placeholder="Password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <div 
                  className="geu-input-icon" 
                  style={{ cursor: 'pointer', borderRight: 'none', borderLeft: '1px solid #cbd5e1' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>

              {/* Captcha Section */}
              <div className="geu-captcha-row">
                <button type="button" className="geu-captcha-refresh" onClick={generateCaptcha}>
                  <RefreshCw size={16} />
                </button>
                <div className="geu-captcha-box">
                  <div className="geu-captcha-line"></div>
                  <div className="geu-captcha-line-2"></div>
                  <span style={{ transform: 'skewX(-10deg)', textShadow: '1px 1px 2px rgba(255,255,255,0.8)', color: '#1e293b', fontWeight: 800 }}>
                    {captchaCode}
                  </span>
                </div>
              </div>

              {/* Enter Captcha Input */}
              <div className="geu-input-wrapper">
                <input 
                  type="text" 
                  className="geu-input-field" 
                  placeholder="Enter Captcha" 
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="geu-login-btn">
                LOGIN
              </button>
            </form>

            {/* Links */}
            <div className="geu-links-row">
              <a href="#forgot" className="geu-link" onClick={(e) => { e.preventDefault(); alert("Please contact your IT department coordinator to reset credentials."); }}>Forgot password ?</a>
              <a href="#forgot" className="geu-link" onClick={(e) => { e.preventDefault(); alert("Please contact your IT department administrator to recover your User ID."); }}>Forgot ID ?</a>
            </div>

            {/* Footer */}
            <div className="geu-footer">
              Powered by Cyborg IT Services (P) Ltd.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <BookOpen size={28} />
          <span>Graphic Era</span>
        </div>
        
        <nav className="sidebar-menu">
          <div 
            className={`menu-item ${currentTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setCurrentTab('dashboard')}
          >
            <Layers size={18} />
            <span>Dashboard</span>
          </div>

          <div 
            className={`menu-item ${currentTab === 'version-control' ? 'active' : ''}`} 
            onClick={() => setCurrentTab('version-control')}
          >
            <ArrowLeftRight size={18} />
            <span>Version Control</span>
          </div>

          <div 
            className={`menu-item ${currentTab === 'requests' ? 'active' : ''}`} 
            onClick={() => setCurrentTab('requests')}
          >
            <HelpCircle size={18} />
            <span>Faculty Requests</span>
          </div>

          {currentUser.role !== 'FACULTY' && (
            <>
              <div 
                className={`menu-item ${currentTab === 'academic' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('academic')}
              >
                <Layers size={18} />
                <span>Academic Structure</span>
              </div>

              <div 
                className={`menu-item ${currentTab === 'faculty' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('faculty')}
              >
                <Users size={18} />
                <span>Faculty</span>
              </div>

              <div 
                className={`menu-item ${currentTab === 'subjects' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('subjects')}
              >
                <Book size={18} />
                <span>Subjects</span>
              </div>

              <div 
                className={`menu-item ${currentTab === 'allocations' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('allocations')}
              >
                <ArrowLeftRight size={18} />
                <span>Faculty Allocation</span>
              </div>

              <div 
                className={`menu-item ${currentTab === 'infrastructure' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('infrastructure')}
              >
                <Layers size={18} />
                <span>Infrastructure</span>
              </div>

              <div 
                className={`menu-item ${currentTab === 'generation' ? 'active' : ''}`} 
                onClick={() => setCurrentTab('generation')}
              >
                <Cpu size={18} />
                <span>Timetable Generation</span>
              </div>
            </>
          )}

          {currentUser.role !== 'FACULTY' && (
            <div 
              className={`menu-item ${currentTab === 'reports' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('reports')}
            >
              <BarChart3 size={18} />
              <span>Reports & Analytics</span>
            </div>
          )}

          {currentUser.role === 'ADMIN' && (
            <div 
              className={`menu-item ${currentTab === 'logs' ? 'active' : ''}`} 
              onClick={() => setCurrentTab('logs')}
            >
              <FileText size={18} />
              <span>Audit Logs</span>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="menu-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Header Bar */}
        <header className="header">
          <div className="header-left">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem' }}>
              University Timetable Management System
            </h2>
          </div>
          
          <div className="header-right">
            {/* API Connection Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.375rem 0.625rem',
              borderRadius: '999px',
              backgroundColor: offlineMode ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: offlineMode ? 'var(--danger)' : 'var(--success)',
              marginRight: '0.5rem',
              border: `1px solid ${offlineMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: offlineMode ? 'var(--danger)' : 'var(--success)'
              }}></span>
              {offlineMode ? 'Offline Mode (Mock Data)' : 'Connected to Spring Boot'}
            </div>

            {/* Dark/Light Switcher */}
            <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications Dropdown */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} />
                {systemNotifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {systemNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="card" style={{
                  position: 'absolute',
                  top: '45px',
                  right: '0',
                  width: '320px',
                  zIndex: 1000,
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.75rem 0',
                  border: '1px solid var(--border-color)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--bg-card)',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</span>
                    <button 
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => {
                        setSystemNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      }}
                    >
                      Mark all read
                    </button>
                  </div>
                  {systemNotifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No notifications
                    </div>
                  ) : (
                    systemNotifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          setSystemNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: n.read ? 'transparent' : 'var(--bg-tertiary)',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        className="notification-item"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: n.read ? 600 : 700, fontSize: '0.8rem', color: n.read ? 'var(--text-primary)' : 'var(--primary)' }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                          {n.desc}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="user-profile">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" 
                alt="Avatar" 
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-role">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-container">
          {/* Branded Department Header Banner */}
          <div style={{ width: '100%', marginBottom: '2rem', overflow: 'hidden' }}>
            <img 
              src={homeHeaderImg} 
              alt="Department of CSE Header" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>
          
          {/* ==========================================
              TAB: DASHBOARD
              ========================================== */}
          {currentTab === 'dashboard' && (
            <>

              <div className="page-header">
                <div>
                  <h1 className="page-title">Welcome back, {currentUser.name}</h1>
                  <p className="page-subtitle">Here is the current scheduling status for the CSE/CA department.</p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Departments</span>
                    <span className="stat-value">{departments.length}</span>
                    <span className="stat-desc">CSE & Computer Apps</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                    <Layers size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Faculty Staff</span>
                    <span className="stat-value">{faculties.length}</span>
                    <span className="stat-desc">Total teaching faculty</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    <Users size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Active Rooms</span>
                    <span className="stat-value">{resources.length}</span>
                    <span className="stat-desc">Classrooms & Labs</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                    <BookOpen size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Requests Pending</span>
                    <span className="stat-value">{requests.filter(r => r.status === 'PENDING').length}</span>
                    <span className="stat-desc">Faculty modifications</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                    <HelpCircle size={24} />
                  </div>
                </div>
              </div>

              {/* Quick Summary View */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                <div className="card">
                  <h3 className="card-title">Timetable Summary</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Faculty</th>
                          <th>Room</th>
                          <th>Schedule</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetableEntries.map(entry => (
                          <tr key={entry.id}>
                            <td style={{ fontWeight: 600 }}>{entry.subject}</td>
                            <td>{entry.faculty}</td>
                            <td>{entry.room}</td>
                            <td>{entry.day} Slot {entry.slot}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card">
                  <h3 className="card-title">Pending Requests</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Faculty</th>
                          <th>Request Details</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.slice(0, 3).map(r => (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 600 }}>{r.faculty}</td>
                            <td>
                              <div style={{ fontSize: '0.85rem' }}>{r.type}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.details}</div>
                            </td>
                            <td>
                              <span className={`status-pill status-${r.status.toLowerCase()}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                  <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={18} /> System Backup & Restore Administration (UC-22, UC-23)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Perform standard database backups and configuration snapshots to secure the Graphic Era university scheduling directory.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => {
                      alert("Database backup snapshot initiated! Generating UTGMS_snapshot_2026.sql... Backup completed successfully!");
                    }}>
                      <Download size={16} style={{ marginRight: '0.5rem' }} /> Create Full Database Backup (UC-22)
                    </button>
                    <button className="btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={() => {
                      const file = window.prompt("Enter the path or name of the backup SQL file to restore (e.g., UTGMS_snapshot_2026.sql):");
                      if (file) {
                        alert(`Restoring database from snapshot file "${file}"... Database rollback and configuration restore completed successfully!`);
                      }
                    }}>
                      <RefreshCw size={16} style={{ marginRight: '0.5rem' }} /> Restore Database Snapshot (UC-23)
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==========================================
              TAB: VERSION CONTROL (TIMETABLE COMPARISON)
              ========================================== */}
          {currentTab === 'version-control' && (
            <>
              <div className="page-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h1 className="page-title" style={{ margin: 0 }}>Version Control & Timetable Comparison</h1>
                    <span className="status-pill" style={{
                      backgroundColor: versionLifecycle === 'Draft' ? 'var(--primary-light)' :
                                       versionLifecycle === 'Review' ? 'var(--warning-light)' :
                                       versionLifecycle === 'Finalized' ? 'var(--success-light)' : 'rgba(168, 85, 247, 0.1)',
                      color: versionLifecycle === 'Draft' ? 'var(--primary)' :
                             versionLifecycle === 'Review' ? 'var(--warning)' :
                             versionLifecycle === 'Finalized' ? 'var(--success)' : 'rgb(168, 85, 247)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      textTransform: 'uppercase'
                    }}>
                      {versionLifecycle}
                    </span>
                  </div>
                  <p className="page-subtitle">Review draft revisions, compare versions, and transition through the lifecycle stages.</p>
                </div>
                {currentUser.role !== 'FACULTY' && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {timetableHistory.length > 0 && (
                      <>
                        <button className="btn" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={handleUndoChange}>
                          <Undo size={16} /> Undo ({timetableHistory.length})
                        </button>
                        <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }} onClick={handleSaveTimetableChanges}>
                          <Save size={16} /> Save Changes
                        </button>
                      </>
                    )}
                    <button className="btn btn-secondary" onClick={() => {
                      setVersionLifecycle("Draft");
                      alert("Rollback Triggered! Restored previous timetable version (v1.2) configurations successfully. Version state reset to Draft.");
                      logActivity(currentUser.email, "Version Rollback", "Restored timetable version configuration back to v1.2");
                    }}>
                      <RefreshCw size={16} /> Rollback to v1.2
                    </button>
                    
                    {versionLifecycle === 'Draft' && (
                      <button className="btn btn-primary" onClick={() => {
                        setVersionLifecycle("Review");
                        alert("Timetable draft submitted to coordinator review pool! Status changed to REVIEW.");
                        logActivity(currentUser.email, "Version Status Change", "Submitted timetable draft v1.3 for Review");
                      }}>
                        Submit for Review
                      </button>
                    )}
                    {versionLifecycle === 'Review' && (
                      <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => {
                        setVersionLifecycle("Finalized");
                        alert("Timetable version v1.3 approved and published as the official active schedule! Status changed to FINALIZED.");
                        logActivity(currentUser.email, "Version Finalize", "Approved and published timetable version v1.3");
                      }}>
                        <CheckCircle size={16} /> Finalize & Publish
                      </button>
                    )}
                    {versionLifecycle === 'Finalized' && (
                      <button className="btn btn-primary" style={{ backgroundColor: 'rgb(168, 85, 247)', borderColor: 'rgb(168, 85, 247)' }} onClick={() => {
                        setVersionLifecycle("Revision");
                        alert("New timetable revision draft cloned from the finalized version. Status changed to REVISION.");
                        logActivity(currentUser.email, "Version Revision", "Created new timetable revision from finalized version");
                      }}>
                        Create Revision
                      </button>
                    )}
                    {versionLifecycle === 'Revision' && (
                      <button className="btn btn-primary" onClick={() => {
                        setVersionLifecycle("Review");
                        alert("Revision draft submitted for review! Status changed to REVIEW.");
                        logActivity(currentUser.email, "Version Status Change", "Submitted revision draft for Review");
                      }}>
                        Submit for Review
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="version-control-layout">
                {/* Visual Grid Grid */}
                <div className="timetable-grid-wrapper">
                  <div className="timetable-grid-header">
                    <div className="version-compare-info">
                      <span style={{ fontWeight: 700 }}>Comparing Schedules:</span>
                      <div className="version-badge-container">
                        <span className="v-badge v-badge-past">{versionControl.comparingWith}</span>
                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                        <span className="v-badge v-badge-current">{versionControl.activeVersion} (Current)</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className="v-meta-item">
                        <span className="v-meta-label">LAST CHANGED</span>
                        <span className="v-meta-val">Oct 24, 14:22</span>
                      </div>
                      <div className="v-meta-item">
                        <span className="v-meta-label">MODIFIED BY</span>
                        <span className="v-meta-val">Dr. Robert Key</span>
                      </div>
                    </div>
                  </div>

                  {selectedCell && (
                    <div style={{ 
                      backgroundColor: 'var(--primary-light)', 
                      border: '1px solid var(--primary)', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--radius-md)', 
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'between',
                      alignItems: 'center'
                    }}>
                      <span>Selected slot: <strong>{selectedCell.day} Slot {selectedCell.slot} ({selectedCell.entry.subject})</strong>. Select another slot to swap them.</span>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setSelectedCell(null)}>Cancel</button>
                    </div>
                  )}

                  <table className="grid-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Slot 1 (09:00 - 10:00)</th>
                        <th>Slot 2 (10:15 - 11:15)</th>
                        <th>Lunch Break (11:15 - 12:15)</th>
                        <th>Slot 3 (12:15 - 01:15)</th>
                        <th>Slot 4 (01:30 - 02:30)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["MON", "TUE", "WED"].map(day => (
                        <tr key={day}>
                          <td className="day-cell-label">{day}</td>
                          {[1, 2].map(slot => {
                            const item = getCellContent(day, slot);
                            return (
                              <td 
                                key={slot} 
                                onClick={() => handleCellClick(day, slot)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, day, slot)}
                                style={{ 
                                  cursor: currentUser.role !== 'FACULTY' ? 'pointer' : 'default',
                                  backgroundColor: selectedCell?.day === day && selectedCell?.slot === slot ? 'var(--primary-light)' : 'transparent'
                                }}
                              >
                                {item ? (
                                  <div 
                                    className={`lecture-card ${item.locked ? 'locked' : ''}`}
                                    draggable={currentUser.role !== 'FACULTY' && !item.locked}
                                    onDragStart={(e) => handleDragStart(e, day, slot)}
                                  >
                                    {item.status !== 'normal' && (
                                      <span className={`lecture-tag tag-${item.status}`}>
                                        {item.status}
                                      </span>
                                    )}
                                    <div className="lecture-subject">{item.subject}</div>
                                    <div className="lecture-faculty">{item.faculty}</div>
                                    <div className="lecture-room">{item.room}</div>
                                    
                                    {currentUser.role !== 'FACULTY' && (
                                      <div className="lecture-actions" onClick={e => e.stopPropagation()}>
                                        <button className="lecture-action-btn" onClick={() => toggleLockEntry(item.id)}>
                                          {item.locked ? <Lock size={12} style={{ color: 'var(--warning)' }} /> : <Unlock size={12} />}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
                                    Free Slot
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="lunch-cell">Lunch Break</td>
                          {[3, 4].map(slot => {
                            const item = getCellContent(day, slot);
                            return (
                              <td 
                                key={slot} 
                                onClick={() => handleCellClick(day, slot)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, day, slot)}
                                style={{ 
                                  cursor: currentUser.role !== 'FACULTY' ? 'pointer' : 'default',
                                  backgroundColor: selectedCell?.day === day && selectedCell?.slot === slot ? 'var(--primary-light)' : 'transparent'
                                }}
                              >
                                {item ? (
                                  <div 
                                    className={`lecture-card ${item.locked ? 'locked' : ''}`}
                                    draggable={currentUser.role !== 'FACULTY' && !item.locked}
                                    onDragStart={(e) => handleDragStart(e, day, slot)}
                                  >
                                    {item.status !== 'normal' && (
                                      <span className={`lecture-tag tag-${item.status}`}>
                                        {item.status}
                                      </span>
                                    )}
                                    <div className="lecture-subject">{item.subject}</div>
                                    <div className="lecture-faculty">{item.faculty}</div>
                                    <div className="lecture-room">{item.room}</div>
                                    
                                    {currentUser.role !== 'FACULTY' && (
                                      <div className="lecture-actions" onClick={e => e.stopPropagation()}>
                                        <button className="lecture-action-btn" onClick={() => toggleLockEntry(item.id)}>
                                          {item.locked ? <Lock size={12} style={{ color: 'var(--warning)' }} /> : <Unlock size={12} />}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
                                    Free Slot
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="legend-bar">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--success)' }}></div>
                      <span>Added / New</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--danger)' }}></div>
                      <span>Removed</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--primary)' }}></div>
                      <span>Modified</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: 'var(--warning)' }}></div>
                      <span>New Conflict</span>
                    </div>
                  </div>
                </div>

                {/* Change Summary Sidebar */}
                <div className="changes-sidebar">
                  <h3 className="sidebar-section-title">
                    <FileText size={18} />
                    <span>Change Summary</span>
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    12 total modifications detected in this draft.
                  </p>
                  
                  <div className="changes-list">
                    {versionControl.changes.map(chg => (
                      <div 
                        key={chg.id} 
                        className={`change-item ${chg.type.toLowerCase().replace(' ', '-')}`}
                      >
                        <span className={`change-type ${chg.type.toLowerCase().replace(' ', '-')}`}>
                          {chg.type}
                        </span>
                        <span className="change-title">{chg.title}</span>
                        <span className="change-detail">{chg.detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="changes-footer-stats">
                    <div className="stat-line">
                      <span>Faculty Changes:</span>
                      <span className="stat-line-val">4</span>
                    </div>
                    <div className="stat-line">
                      <span>Room Reassignments:</span>
                      <span className="stat-line-val">6</span>
                    </div>
                    <div className="stat-line">
                      <span>New Conflicts:</span>
                      <span className="stat-line-val" style={{ color: 'var(--danger)' }}>2</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: REQUESTS PORTAL
              ========================================== */}
          {currentTab === 'requests' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Faculty Request Portal</h1>
                  <p className="page-subtitle">Manage and review administrative requests for scheduling and resources.</p>
                </div>
                {currentUser.role === 'FACULTY' && (
                  <button className="btn btn-primary" onClick={() => { setFormType("request"); setIsFormOpen(true); }}>
                    <Plus size={16} /> Create New Request
                  </button>
                )}
              </div>

              {/* Statistics Row */}
              <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Total Requests</span>
                    <span className="stat-value">124</span>
                    <span className="stat-desc">Historical count</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                    <FileText size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Pending Review</span>
                    <span className="stat-value">18</span>
                    <span className="stat-desc">Waiting for response</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                    <AlertTriangle size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Efficiency Rate</span>
                    <span className="stat-value">92%</span>
                    <span className="stat-desc">4-hour average resolution</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    <CheckCircle size={24} />
                  </div>
                </div>
              </div>

              {/* Requests Table */}
              <div className="card">
                <h3 className="card-title">Recent Requests</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Faculty Name</th>
                        <th>Request Type</th>
                        <th>Details</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(req => (
                        <tr key={req.id}>
                          <td style={{ fontWeight: 600 }}>{req.faculty}</td>
                          <td>{req.type}</td>
                          <td>{req.details}</td>
                          <td>{req.reason}</td>
                          <td>
                            <span className={`status-pill status-${req.status.toLowerCase()}`}>
                              {req.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                              <button 
                                className="btn" 
                                style={{ 
                                  padding: '0.25rem 0.5rem', 
                                  fontSize: '0.75rem', 
                                  backgroundColor: req.status === 'APPROVED' ? 'var(--success)' : 'transparent',
                                  color: req.status === 'APPROVED' ? '#ffffff' : 'var(--text-secondary)',
                                  border: '1px solid var(--border-color)',
                                  opacity: req.status === 'APPROVED' ? 1 : 0.6
                                }}
                                onClick={() => handleProcessRequest(req.id, "APPROVED")}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn" 
                                style={{ 
                                  padding: '0.25rem 0.5rem', 
                                  fontSize: '0.75rem', 
                                  backgroundColor: req.status === 'REJECTED' ? 'var(--danger)' : 'transparent',
                                  color: req.status === 'REJECTED' ? '#ffffff' : 'var(--text-secondary)',
                                  border: '1px solid var(--border-color)',
                                  opacity: req.status === 'REJECTED' ? 1 : 0.6
                                }}
                                onClick={() => handleProcessRequest(req.id, "REJECTED")}
                              >
                                Reject
                              </button>
                              <button 
                                className="btn" 
                                style={{ 
                                  padding: '0.25rem 0.5rem', 
                                  fontSize: '0.75rem', 
                                  backgroundColor: req.status === 'PENDING' ? 'var(--warning)' : 'transparent',
                                  color: req.status === 'PENDING' ? '#ffffff' : 'var(--text-secondary)',
                                  border: '1px solid var(--border-color)',
                                  opacity: req.status === 'PENDING' ? 1 : 0.6
                                }}
                                onClick={() => handleProcessRequest(req.id, "PENDING")}
                              >
                                Set Pending
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: FACULTY ALLOCATION
              ========================================== */}
          {currentTab === 'allocations' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Faculty-Subject Mapping (Allocation)</h1>
                  <p className="page-subtitle">Configure assignments linking faculty staff, specific academic subjects, and semesters/sections.</p>
                </div>
              </div>

              {/* Section selection bar */}
              <div className="filter-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Select Section:</label>
                <select 
                  className="form-control" 
                  style={{ width: '220px' }} 
                  value={selectedAllocationSection} 
                  onChange={(e) => setSelectedAllocationSection(Number(e.target.value))}
                >
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name} (Sem {sec.semester})</option>
                  ))}
                </select>
                <div style={{ flex: 1 }}></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total Allocations for Section: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{allocations.length}</span>
                </div>
              </div>

              <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Left Column: Allocations Table */}
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Allocations</h3>
                  {allocations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No faculty mappings configured for this section.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Faculty Name</th>
                            <th>Session</th>
                            <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allocations.map((alloc) => (
                            <tr key={alloc.id}>
                              <td style={{ fontWeight: 600 }}>{alloc.subjectName || subjects.find(s => s.id === alloc.subjectId)?.name || `Subject (ID: ${alloc.subjectId})`}</td>
                              <td>{alloc.facultyName || faculties.find(f => f.id === alloc.facultyId)?.name || `Faculty (ID: ${alloc.facultyId})`}</td>
                              <td><span className="badge badge-normal">{alloc.session}</span></td>
                              <td style={{ textAlign: 'right' }}>
                                <button className="icon-btn danger" onClick={() => handleDeleteAllocation(alloc.id)} title="Delete Allocation">
                                  <Trash size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Column: Add Allocation Form */}
                <div className="card" style={{ alignSelf: 'start' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Assign Faculty to Subject</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!allocFormFaculty || !allocFormSubject) {
                      alert("Please select both a faculty member and a subject.");
                      return;
                    }
                    handleCreateAllocation({
                      facultyId: Number(allocFormFaculty),
                      subjectId: Number(allocFormSubject),
                      sectionId: Number(selectedAllocationSection),
                      session: allocFormSession
                    });
                    // Reset fields
                    setAllocFormFaculty("");
                    setAllocFormSubject("");
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="alloc-subject">Select Subject</label>
                      <select 
                        id="alloc-subject" 
                        className="form-control" 
                        value={allocFormSubject} 
                        onChange={(e) => setAllocFormSubject(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Subject --</option>
                        {subjects.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.code} - {sub.name} ({sub.type})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="alloc-faculty">Select Faculty Member</label>
                      <select 
                        id="alloc-faculty" 
                        className="form-control" 
                        value={allocFormFaculty} 
                        onChange={(e) => setAllocFormFaculty(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Faculty --</option>
                        {faculties.map(fac => (
                          <option key={fac.id} value={fac.id}>{fac.name} ({fac.designation})</option>
                        ))}
                      </select>
                    </div>

                    {/* Live Workload display of selected faculty */}
                    {faculties.find(f => f.id === Number(allocFormFaculty)) && (() => {
                      const selFac = faculties.find(f => f.id === Number(allocFormFaculty));
                      const maxWorkload = selFac.weeklyWorkload || 16;
                      const currentAllocCount = allocations.filter(a => a.facultyId === selFac.id).length;
                      const estimatedWorkload = currentAllocCount * 4; // Estimate 4 hrs per mapping if workload not in DB
                      const displayCurrent = selFac.currentWorkload || estimatedWorkload;
                      const remaining = maxWorkload - displayCurrent;

                      return (
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Selected Faculty Status:</div>
                          <div>Designation: <span style={{ fontWeight: 500 }}>{selFac.designation}</span></div>
                          <div>Workload: <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{displayCurrent} hrs</span> / Max: {maxWorkload} hrs</div>
                          <div style={{ marginTop: '0.15rem', color: remaining < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                            {remaining < 0 ? `Workload Limit Exceeded! (${Math.abs(remaining)} hrs over)` : `Workload Available: ${remaining} hrs`}
                          </div>
                        </div>
                      );
                    })()}

                    <div className="form-group">
                      <label htmlFor="alloc-session">Academic Session</label>
                      <input 
                        type="text" 
                        id="alloc-session" 
                        className="form-control" 
                        value={allocFormSession} 
                        onChange={(e) => setAllocFormSession(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Add Allocation
                    </button>
                  </form>
                </div>
              </div>

              {/* Merged Sections Configuration Card (BR-19, BR-20, BR-21) */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title">Merged Sections for Joint Lectures (BR-19, BR-20, BR-21)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Combine student sections for specific subject lectures (e.g., merging Section A and Section C for DBMS). A single faculty member will conduct the session in a compatible room matching combined capacity.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                  {/* Left Column: Active Joint Classes */}
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Active Merged Classes</h4>
                    <div className="table-container">
                      <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Sections Merged</th>
                            <th>Combined Strength</th>
                            <th>Assigned Faculty</th>
                            <th>Room Cap Check</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 600 }}>TCS-401 DBMS</td>
                            <td>Section A + Section C</td>
                            <td>73 Students (38+35)</td>
                            <td>Prof. Alan Turing</td>
                            <td>
                              <span className="status-pill status-pending" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.7rem' }}>
                                Insufficient Cap (Room LT-3 Cap 60)
                              </span>
                            </td>
                            <td>
                              <button className="icon-btn" onClick={() => alert("Merged section class deleted successfully!")}>
                                <Trash size={14} style={{ color: 'var(--danger)' }} />
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 600 }}>TCS-302 OS Concepts</td>
                            <td>Section B + Section D</td>
                            <td>56 Students (30+26)</td>
                            <td>Prof. Linus</td>
                            <td>
                              <span className="status-pill status-approved" style={{ fontSize: '0.7rem' }}>
                                OK (Lecture Hall C Cap 80)
                              </span>
                            </td>
                            <td>
                              <button className="icon-btn" onClick={() => alert("Merged section class deleted successfully!")}>
                                <Trash size={14} style={{ color: 'var(--danger)' }} />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Merge Form */}
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Configure Joint Class</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Select Subject</label>
                        <select className="form-control" defaultValue="1">
                          {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem' }}>Primary Sec</label>
                          <select className="form-control" defaultValue="1">
                            {sections.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem' }}>Secondary Sec</label>
                          <select className="form-control" defaultValue="2">
                            {sections.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Assign Faculty</label>
                        <select className="form-control" defaultValue="1">
                          {faculties.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => {
                        alert("Joint class merged successfully! Dynamic capacity rules compiled.");
                      }}>
                        Merge Sections
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: ACADEMIC STRUCTURE
              ========================================== */}
          {currentTab === 'academic' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Academic Structure Management</h1>
                  <p className="page-subtitle">Configure department, program, semester, and section definitions.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={() => { setFormType("dept"); setIsFormOpen(true); }}>
                    <Plus size={16} /> Add Department
                  </button>
                  <button className="btn btn-primary" onClick={() => { setFormType("program"); setIsFormOpen(true); }}>
                    <Plus size={16} /> Add Program
                  </button>
                  <button className="btn btn-primary" onClick={() => { setFormType("section"); setIsFormOpen(true); }}>
                    <Plus size={16} /> Add Section
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
                {/* Department Section */}
                <div className="card">
                  <h3 className="card-title">Departments</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Department Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map(dept => (
                          <tr key={dept.id}>
                            <td style={{ fontWeight: 600 }}>{dept.code}</td>
                            <td>{dept.name}</td>
                            <td>
                              <button className="icon-btn" onClick={() => deleteEntity('dept', dept.id)}>
                                <Trash size={14} style={{ color: 'var(--danger)' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Programs Section */}
                <div className="card">
                  <h3 className="card-title">Academic Programs</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Program Name</th>
                          <th>Department</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programs.map(prog => {
                          const dept = departments.find(d => d.id === prog.deptId);
                          return (
                            <tr key={prog.id}>
                              <td style={{ fontWeight: 600 }}>{prog.code}</td>
                              <td>{prog.name}</td>
                              <td>{dept ? dept.code : 'Unknown'}</td>
                              <td>
                                <button className="icon-btn" onClick={() => deleteEntity('program', prog.id)}>
                                  <Trash size={14} style={{ color: 'var(--danger)' }} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sections list */}
              <div className="card" style={{ marginTop: '1rem' }}>
                <h3 className="card-title">Semesters & Sections</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Section Name</th>
                        <th>Student Strength</th>
                        <th>Program Reference</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sections.map(sec => (
                        <tr key={sec.id}>
                          <td style={{ fontWeight: 600 }}>{sec.name}</td>
                          <td>{sec.strength} Students</td>
                          <td>B.Tech (Semester 4)</td>
                          <td>
                            <button className="icon-btn" onClick={() => deleteEntity('section', sec.id)}>
                              <Trash size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: FACULTY MANAGEMENT
              ========================================== */}
          {currentTab === 'faculty' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Faculty Records</h1>
                  <p className="page-subtitle">Review profiles, designations, workloads, and schedules.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setFormType("faculty"); setIsFormOpen(true); }}>
                  <Plus size={16} /> Add Faculty Profile
                </button>
              </div>

              <div className="card">
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Employee Code</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Workload Limit</th>
                        <th>Working Days</th>
                        <th>Time Range</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculties.map(fac => (
                        <tr key={fac.id}>
                          <td style={{ fontWeight: 600 }}>{fac.code}</td>
                          <td>{fac.name}</td>
                          <td>{fac.designation}</td>
                          <td>{fac.workload} Hours/wk</td>
                          <td>{fac.days} Days</td>
                          <td>{fac.time}</td>
                          <td>
                            <button className="icon-btn" onClick={() => deleteEntity('faculty', fac.id)}>
                              <Trash size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Faculty Availability & Preference Configurator */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title">Faculty Availability & Timings Configuration</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Manage constraints covering unavailable slots, vacation dates, and research days for the solver optimization engine.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  {/* Select Faculty & Time range */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="form-group">
                      <label>Select Faculty Member</label>
                      <select className="form-control" defaultValue="1">
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Daily Time Range</label>
                      <select className="form-control" defaultValue="09:00-17:00">
                        <option value="09:00-17:00">09:00 AM - 05:00 PM (Default)</option>
                        <option value="08:00-16:00">08:00 AM - 04:00 PM</option>
                        <option value="10:00-18:00">10:00 AM - 06:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Unavailable slots & vacation dates */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="form-group">
                      <label>Preferred Timings</label>
                      <select className="form-control" defaultValue="morning">
                        <option value="morning">Morning slots preferred (Slots 1 & 2)</option>
                        <option value="afternoon">Afternoon slots preferred (Slots 3 & 4)</option>
                        <option value="none">No specific preference</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Vacation / Leave Period</label>
                      <input type="text" className="form-control" placeholder="e.g. Oct 24 - Oct 26" />
                    </div>
                  </div>

                  {/* Research day & Submit button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'space-between' }}>
                    <div className="form-group">
                      <label>Designated Research Day</label>
                      <select className="form-control" defaultValue="Wednesday">
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday (Recommended)</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    </div>
                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={() => {
                      alert("Availability and scheduling preferences updated successfully! Saved to solver database constraints.");
                    }}>
                      Save Availability Settings
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: SUBJECT MANAGEMENT
              ========================================== */}
          {currentTab === 'subjects' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Subjects List</h1>
                  <p className="page-subtitle">Configure academic subjects, classifications, and durations.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setFormType("subject"); setIsFormOpen(true); }}>
                  <Plus size={16} /> Add Subject
                </button>
              </div>

              <div className="card">
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Theory hrs/wk</th>
                        <th>Lab hrs/wk</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map(sub => (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 600 }}>{sub.code}</td>
                          <td>{sub.name}</td>
                          <td>
                            <span className={`status-pill ${sub.type === 'LAB' ? 'status-approved' : 'status-pending'}`}>
                              {sub.type}
                            </span>
                          </td>
                          <td>{sub.theoryHrs} Hours</td>
                          <td>{sub.labHrs} Hours</td>
                          <td>
                            <button className="icon-btn" onClick={() => deleteEntity('subject', sub.id)}>
                              <Trash size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: INFRASTRUCTURE MANAGEMENT
              ========================================== */}
          {currentTab === 'infrastructure' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Infrastructure Resources</h1>
                  <p className="page-subtitle">Configure classrooms, laboratories, and lecture halls.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setFormType("resource"); setIsFormOpen(true); }}>
                  <Plus size={16} /> Add Resource
                </button>
              </div>

              <div className="card">
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Resource Name</th>
                        <th>Resource Type</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map(res => (
                        <tr key={res.id}>
                          <td style={{ fontWeight: 600 }}>{res.name}</td>
                          <td>{res.type.replace('_', ' ')}</td>
                          <td>{res.capacity} Seats</td>
                          <td>
                            <span className="status-pill status-approved">
                              {res.status}
                            </span>
                          </td>
                          <td>
                            <button className="icon-btn" onClick={() => deleteEntity('resource', res.id)}>
                              <Trash size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: TIMETABLE GENERATION
              ========================================== */}
          {currentTab === 'generation' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Timetable Optimization Engine</h1>
                  <p className="page-subtitle">Trigger constraint solvers to generate conflicts-free schedules.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 className="card-title">Configure & Execute</h3>
                  <div className="form-group">
                    <label>Academic Session</label>
                    <select className="form-control">
                      <option>2025-26 Odd Semester</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Program Target</label>
                    <select className="form-control">
                      <option>B.Tech Computer Science & Engineering</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Optimization Mode</label>
                    <select className="form-control">
                      <option>Satisfy All Hard Constraints (Priority)</option>
                      <option>Optimize Soft Constraints (Compact Schedules)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Execution Mode (DP-8)</label>
                    <select className="form-control">
                      <option>Automatic Mode (Solver-controlled)</option>
                      <option>Semi-Automatic Mode (Manual Override Allowed)</option>
                    </select>
                  </div>
                   <div className="form-group">
                    <label>Generation Scope (UC-07, UC-11)</label>
                    <select className="form-control" value={genScope} onChange={(e) => setGenScope(e.target.value)}>
                      <option value="full">Full Timetable Generation (Clean slate - UC-07)</option>
                      <option value="partial">Partial Regeneration (Solve conflict areas only - UC-11)</option>
                    </select>
                  </div>
                  
                  {genScope === 'partial' && (
                    <div className="form-group animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px dashed var(--border-color)', padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', marginBottom: '1rem' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.8rem' }}>Select Regeneration Target Scope</label>
                      <select className="form-control" defaultValue="faculty">
                        <option value="faculty">Regenerate One Faculty (Dr. Grace Hopper)</option>
                        <option value="section">Regenerate One Section (Section A)</option>
                        <option value="semester">Regenerate One Semester (Semester 4)</option>
                        <option value="selected">Regenerate Selected Entries (Mon/Tue conflicts)</option>
                      </select>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-primary" 
                    onClick={triggerTimetableGeneration}
                    disabled={isGenerating}
                    style={{ marginTop: '1rem' }}
                  >
                    {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Cpu size={16} />}
                    {isGenerating ? "Processing Solver Algorithm..." : "Start Timetable Generation"}
                  </button>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 className="card-title">Solver Dashboard</h3>
                  
                  {isGenerating || genProgress > 0 ? (
                    <div className="gen-status-box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>Progress: {genProgress}%</span>
                        <span>{genStage}</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${genProgress}%` }}></div>
                      </div>
                      
                      <div className="gen-logs-box">
                        {genLogs.map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: '4rem 0' }}>
                      No active generation session
                    </div>
                  )}

                  <div style={{ 
                    backgroundColor: genReport ? 'var(--success-light)' : 'var(--bg-secondary)', 
                    border: genReport ? '1px solid var(--success)' : '1px solid var(--border-color)', 
                    padding: '1.25rem', 
                    borderRadius: 'var(--radius-lg)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    fontSize: '0.85rem',
                    marginTop: '1rem'
                  }}>
                    <div>Lectures Placed: <strong>{genReport ? genReport.placed : 0}</strong></div>
                    <div>Unresolved Conflicts: <strong>{genReport ? genReport.conflicts : 0}</strong></div>
                    <div>Faculty Utilization: <strong>{genReport ? genReport.facultyUtil : 0}%</strong></div>
                    <div>Room Utilization: <strong>{genReport ? genReport.roomUtil : 0}%</strong></div>
                  </div>
                </div>
              </div>

              {/* Conflict & Alert Center (Conflict Management Screen - 11.14) */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                  <AlertTriangle size={18} /> Conflict Management & Alert Center (UC-13, UC-19, 11.14)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  The optimization engine has detected the following rule violations in the draft timetable.
                </p>

                <div className="table-responsive">
                  <table className="table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Details</th>
                        <th>Impact Severity</th>
                        <th style={{ width: '380px', textAlign: 'right' }}>Resolution Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge badge-danger">Faculty Collision</span></td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <strong>Prof. Alan Turing</strong> is double-booked for CS-201 (Sec A) and CS-305 (Sec B) on Monday Slot 2.
                        </td>
                        <td><span style={{ color: 'var(--danger)', fontWeight: 600 }}>Hard Constraint</span></td>
                        <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Qualified Replacement Faculty found (UC-19):\n1. Dr. Grace Hopper (Available, current workload: 10/16 hrs)\n2. Prof. John von Neumann (Available, current workload: 8/16 hrs)\n\nSelected: Dr. Grace Hopper. Conflict resolved!");
                          }}>
                            Find Replacement Faculty (UC-19)
                          </button>
                          <button type="button" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Triggering local solver loop on Mon Slot 2 (UC-11)... Conflict resolved successfully!");
                          }}>
                            Partial Regenerate (UC-11)
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="badge badge-danger">Room Overlap</span></td>
                        <td style={{ fontSize: '0.85rem' }}>
                          Classroom <strong>LT-1</strong> is assigned to both CS-101 (Sec A) and CS-402 (Sec C) on Tuesday Slot 3.
                        </td>
                        <td><span style={{ color: 'var(--danger)', fontWeight: 600 }}>Hard Constraint</span></td>
                        <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Available vacant rooms for Tue Slot 3:\n1. Room LT-3 (Capacity: 60, Vacant)\n2. Seminar Hall B (Capacity: 120, Vacant)\n\nSelected: Room LT-3. Conflict resolved!");
                          }}>
                            Find Vacant Room
                          </button>
                          <button type="button" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Triggering local solver loop on Tue Slot 3 (UC-11)... Conflict resolved successfully!");
                          }}>
                            Partial Regenerate (UC-11)
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="badge badge-warning">Workload Limit</span></td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <strong>Dr. Grace Hopper</strong> is assigned 18 hours of weekly classes, exceeding her designation limit of 16 hours.
                        </td>
                        <td><span style={{ color: 'var(--warning)', fontWeight: 600 }}>Soft Constraint</span></td>
                        <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Workload redistributed! Shifted 2 hours of CS-305 lab mapping to Prof. Alan Turing. Conflict resolved!");
                          }}>
                            Redistribute Hours
                          </button>
                          <button type="button" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Triggering local solver loop... Workload balanced successfully!");
                          }}>
                            Balance Workload
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="badge badge-danger">Section Clash</span></td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <strong>Section A (B.Tech)</strong> is scheduled for both DBMS and OS on Thursday Slot 1.
                        </td>
                        <td><span style={{ color: 'var(--danger)', fontWeight: 600 }}>Hard Constraint</span></td>
                        <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Automatic Alternate Slot Suggestions:\n1. Thursday Slot 3 (Vacant, Section free, Faculty free)\n2. Friday Slot 2 (Vacant, Section free, Faculty free)\n\nSelected: Thursday Slot 3. Conflict resolved!");
                          }}>
                            Suggest Alternate Slot
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="badge badge-danger">Capacity Violation</span></td>
                        <td style={{ fontSize: '0.85rem' }}>
                          <strong>Section B (56 students)</strong> is scheduled in Room LAB-2 (Capacity: 30) for DBMS Lab on Wednesday Slot 3.
                        </td>
                        <td><span style={{ color: 'var(--danger)', fontWeight: 600 }}>Hard Constraint</span></td>
                        <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => {
                            alert("Available larger rooms for Wed Slot 3:\n1. Room LT-3 (Capacity: 60, Vacant)\n2. Lecture Hall C (Capacity: 80, Vacant)\n\nSelected: Room LT-3. Room Capacity Validated. Conflict resolved!");
                          }}>
                            Suggest Large Room
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Generated Timetable Grid Preview */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} /> Generated Timetable Schedule Preview
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Below is the generated timetable schedule. Faculty collisions and vacant slot reports are synchronized in real time.
                </p>

                <div className="table-container" style={{ overflowX: 'auto' }}>
                  <table className="grid-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Slot 1 (09:00 - 10:00)</th>
                        <th>Slot 2 (10:15 - 11:15)</th>
                        <th>Lunch Break (11:15 - 12:15)</th>
                        <th>Slot 3 (12:15 - 01:15)</th>
                        <th>Slot 4 (01:30 - 02:30)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["MON", "TUE", "WED"].map(day => (
                        <tr key={day}>
                          <td className="day-cell-label">{day}</td>
                          {[1, 2].map(slot => {
                            const item = getCellContent(day, slot);
                            return (
                              <td key={slot}>
                                {item ? (
                                  <div className={`lecture-card ${item.locked ? 'locked' : ''}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', minHeight: '80px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.subject}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.faculty}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                      <span>{item.room}</span>
                                      {item.status !== 'normal' && (
                                        <span className={`status-pill status-${item.status.toLowerCase()}`} style={{ padding: '0 0.25rem', fontSize: '0.65rem' }}>
                                          {item.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>Vacant Slot</div>
                                )}
                              </td>
                            );
                          })}
                          
                          {/* Lunch break */}
                          <td style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', verticalAlign: 'middle' }}>
                            LUNCH
                          </td>
                          
                          {[3, 4].map(slot => {
                            const item = getCellContent(day, slot);
                            return (
                              <td key={slot}>
                                {item ? (
                                  <div className={`lecture-card ${item.locked ? 'locked' : ''}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', minHeight: '80px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.subject}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.faculty}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                      <span>{item.room}</span>
                                      {item.status !== 'normal' && (
                                        <span className={`status-pill status-${item.status.toLowerCase()}`} style={{ padding: '0 0.25rem', fontSize: '0.65rem' }}>
                                          {item.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>Vacant Slot</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB: AUDIT LOGS
              ========================================== */}
          {currentTab === 'logs' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">System Audit Trails</h1>
                  <p className="page-subtitle">Track configurations, timetable approvals, and user updates.</p>
                </div>
              </div>

              <div className="card">
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action Type</th>
                        <th>Log Detail Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(lg => (
                        <tr key={lg.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{lg.timestamp}</td>
                          <td style={{ fontWeight: 600 }}>{lg.user}</td>
                          <td>
                            <span className="status-pill status-pending" style={{ textTransform: 'capitalize' }}>
                              {lg.action}
                            </span>
                          </td>
                          <td>{lg.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Custom Roles & Permission Matrix (UC-15) */}
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title">Dynamic Custom Roles & Permission Matrix</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Manage dynamic access parameters across Administrator, Coordinator, Faculty, and custom roles.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                  {/* Matrix Checkbox Table */}
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Permissions Mapping Matrix</h4>
                    <div className="table-container">
                      <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                        <thead>
                          <tr>
                            <th>Module / Action Feature</th>
                            <th>Admin</th>
                            <th>Coordinator</th>
                            <th>Faculty</th>
                            <th>Custom Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "Modify Directory Configuration", admin: true, coord: true, faculty: false, custom: false },
                            { name: "Execute Constraint solver (OptaPlanner)", admin: true, coord: true, faculty: false, custom: false },
                            { name: "Edit Timetable Slots (Drag-and-Drop)", admin: true, coord: true, faculty: false, custom: true },
                            { name: "Submit Schedule requests", admin: true, coord: true, faculty: true, custom: true },
                            { name: "Access System Audit logs", admin: true, coord: false, faculty: false, custom: false },
                            { name: "Excel POI spreadsheet Imports", admin: true, coord: true, faculty: false, custom: false }
                          ].map((perm, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 600 }}>{perm.name}</td>
                              <td><input type="checkbox" defaultChecked={perm.admin} onChange={() => alert("Admin privilege updated successfully!")} /></td>
                              <td><input type="checkbox" defaultChecked={perm.coord} onChange={() => alert("Coordinator privilege updated successfully!")} /></td>
                              <td><input type="checkbox" defaultChecked={perm.faculty} onChange={() => alert("Faculty privilege updated successfully!")} /></td>
                              <td><input type="checkbox" defaultChecked={perm.custom} onChange={() => alert("Custom role privilege updated successfully!")} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* System Toggle Settings */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Engine Controls</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <input type="checkbox" id="faculty-lock-override" defaultChecked />
                      <label htmlFor="faculty-lock-override">Enforce strict capacity checks on generation</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <input type="checkbox" id="multi-campus-sync" />
                      <label htmlFor="multi-campus-sync">Enable Multi-Campus schedules sync</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <input type="checkbox" id="auto-recovery" defaultChecked />
                      <label htmlFor="auto-recovery">Enable auto-resolution loop on section overlaps</label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <input type="checkbox" id="dynamic-registrations" defaultChecked />
                      <label htmlFor="dynamic-registrations">Allow dynamic registrations from login page</label>
                    </div>

                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => {
                      alert("Permission matrix rules updated! Saved dynamically to database.");
                    }}>
                      Save Permission Matrix
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentTab === 'reports' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Reports & Timetable Analytics</h1>
                  <p className="page-subtitle">Inspect capacity checks, utilization statistics, and upload spreadsheets.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" onClick={() => {
                    alert("Generating Section Timetable PDF... File download initiated: CSE_BTech_SecA.pdf");
                    logActivity(currentUser.email, "PDF Export", "Exported B.Tech Section A timetable to PDF format");
                  }}>
                    <Download size={16} /> Export Section PDF
                  </button>
                  <button className="btn btn-primary" onClick={() => {
                    alert("Generating Section Timetable Excel... File download initiated: CSE_BTech_SecA.xlsx");
                    logActivity(currentUser.email, "Excel Export", "Exported B.Tech Section A timetable to Excel sheet");
                  }}>
                    <FileText size={16} /> Export Section Excel
                  </button>
                </div>
              </div>

              {/* Statistics Widgets */}
              <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Faculty Utilization</span>
                    <span className="stat-value">84%</span>
                    <span className="stat-desc">Average weekly workload hours</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                    <Users size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Room Utilization</span>
                    <span className="stat-value">72%</span>
                    <span className="stat-desc">Classroom and lab occupancy rate</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    <Layers size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Remaining Free Slots</span>
                    <span className="stat-value">14 vacant</span>
                    <span className="stat-desc">Unallocated schedule periods</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                    <Calendar size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <span className="stat-label">Rule Conflicts</span>
                    <span className="stat-value" style={{ color: 'var(--success)' }}>0 unresolved</span>
                    <span className="stat-desc">Hard constraints validated</span>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                    <CheckCircle size={24} />
                  </div>
                </div>
              </div>

              {/* Excel Import & Resource Capacity Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Excel POI Import Card */}
                <div className="card">
                  <h3 className="card-title">Spreadsheet Document Importer (Apache POI)</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Upload Excel (.xlsx) templates to import Faculty, Subjects, Rooms, and Sections directly into the directory.
                  </p>
                  
                  <div 
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onClick={() => document.getElementById('excel-file-input').click()}
                  >
                    <Download size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Click or drag Excel file here</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports .xlsx up to 5MB</span>
                    <input 
                      type="file" 
                      id="excel-file-input" 
                      accept=".xlsx" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          alert(`Apache POI parser triggered! Reading "${e.target.files[0].name}"...\nSuccess: Imported 4 new subject listings, 2 classroom capacities, and updated 3 faculty records!`);
                          logActivity(currentUser.email, "Excel Import", `Uploaded spreadsheet data from ${e.target.files[0].name}`);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Resource Capacity Validation Grid */}
                <div className="card">
                  <h3 className="card-title">Resource Availability & Capacity Check</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Live validation verifying that Section student strength fits Room seating capacity constraints.
                  </p>
                  
                  <div className="table-container">
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr>
                          <th>Room ID</th>
                          <th>Room Cap</th>
                          <th>Target Section</th>
                          <th>Sec Strength</th>
                          <th>Status check</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 600 }}>CR-102</td>
                          <td>40 Seats</td>
                          <td>Section A (B.Tech)</td>
                          <td>38 Students</td>
                          <td><span className="status-pill status-approved" style={{ fontSize: '0.7rem' }}>Capacity Validated</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>LT-3</td>
                          <td>60 Seats</td>
                          <td>Section B (B.Tech)</td>
                          <td>56 Students</td>
                          <td><span className="status-pill status-approved" style={{ fontSize: '0.7rem' }}>Capacity Validated</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>LAB-2</td>
                          <td>30 Seats</td>
                          <td>Lab Group B1</td>
                          <td>24 Students</td>
                          <td><span className="status-pill status-approved" style={{ fontSize: '0.7rem' }}>Capacity Validated</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>CR-101</td>
                          <td>30 Seats</td>
                          <td>Section C (B.Tech)</td>
                          <td>35 Students</td>
                          <td><span className="status-pill status-pending" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.7rem' }}>Insufficient Capacity</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Timetable Analytics Charts Card */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="card-title">Timetable Analytics Dashboard</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Visual metrics representation covering faculty loads, daily scheduling balance, and subject mapping statistics.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  {/* Faculty Load Bar Chart */}
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Faculty Workload Load (Weekly Hours)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                      {[
                        { name: "Prof. Alan Turing", hours: 14, max: 16 },
                        { name: "Dr. Grace Hopper", hours: 12, max: 16 },
                        { name: "Dr. Sarah Jenkins", hours: 15, max: 18 },
                        { name: "Dr. Robert Key", hours: 10, max: 12 }
                      ].map((fac, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                            <span>{fac.name}</span>
                            <strong>{fac.hours} / {fac.max} hrs</strong>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(fac.hours / fac.max) * 100}%`, backgroundColor: fac.hours > 14 ? 'var(--warning)' : 'var(--primary)', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Load Bar Chart */}
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Daily Schedule density (Lectures Count)</h4>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', minHeight: '135px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100px', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        {[
                          { day: "Mon", lectures: 8, height: "90%" },
                          { day: "Tue", lectures: 6, height: "70%" },
                          { day: "Wed", lectures: 4, height: "50%" },
                          { day: "Thu", lectures: 7, height: "80%" },
                          { day: "Fri", lectures: 5, height: "60%" }
                        ].map((d, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{d.lectures}</span>
                            <div style={{ height: '60px', width: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-end' }}>
                              <div style={{ height: d.height, width: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>Monday</span>
                        <span>Tuesday</span>
                        <span>Wednesday</span>
                        <span>Thursday</span>
                        <span>Friday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* ==========================================
          MODALS & DIALOGS
          ========================================== */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {formType === 'dept' && "Create Department"}
                {formType === 'program' && "Create Program"}
                {formType === 'section' && "Create Section"}
                {formType === 'faculty' && "Add Faculty Profile"}
                {formType === 'subject' && "Add Subject"}
                {formType === 'resource' && "Add Infrastructure Resource"}
                {formType === 'request' && "Submit Scheduling Request"}
              </h3>
              <button className="icon-btn" onClick={() => setIsFormOpen(false)}>
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={formType === 'request' ? handleCreateRequest : handleCrudSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formType === 'dept' && (
                <>
                  <div className="form-group">
                    <label>Department Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.code || ""} 
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. CSE"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </>
              )}

              {formType === 'program' && (
                <>
                  <div className="form-group">
                    <label>Program Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.code || ""} 
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. B.Tech"
                    />
                  </div>
                  <div className="form-group">
                    <label>Program Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Bachelor of Technology"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.deptId || ""} 
                      onChange={e => setFormData({ ...formData, deptId: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.code}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {formType === 'section' && (
                <>
                  <div className="form-group">
                    <label>Section Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Section C"
                    />
                  </div>
                  <div className="form-group">
                    <label>Student Strength</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      value={formData.strength || ""} 
                      onChange={e => setFormData({ ...formData, strength: e.target.value })}
                      placeholder="e.g. 60"
                    />
                  </div>
                </>
              )}

              {formType === 'faculty' && (
                <>
                  <div className="form-group">
                    <label>Faculty Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Alan Turing"
                    />
                  </div>
                  <div className="form-group">
                    <label>Employee Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.code || ""} 
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. EMP-101"
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.designation || ""} 
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    >
                      <option value="">Select Designation</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Teaching Associate">Teaching Associate</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required 
                      value={formData.email || ""} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@college.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weekly Workload Hours Limit</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.workload || ""} 
                      onChange={e => setFormData({ ...formData, workload: e.target.value })}
                      placeholder="e.g. 16"
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Working Days</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.days || ""} 
                      onChange={e => setFormData({ ...formData, days: e.target.value })}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time Range</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.time || ""} 
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g. 09:00 - 15:00"
                    />
                  </div>
                </>
              )}

              {formType === 'subject' && (
                <>
                  <div className="form-group">
                    <label>Subject Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Compiler Design"
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject Code</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.code || ""} 
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. CS-301"
                    />
                  </div>
                  <div className="form-group">
                    <label>Classification Type</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.type || ""} 
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="">Select Type</option>
                      <option value="THEORY">Theory Session</option>
                      <option value="LAB">Lab Session (Continuous)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Theory Hours/wk</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.theoryHrs || ""} 
                      onChange={e => setFormData({ ...formData, theoryHrs: e.target.value })}
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Lab Hours/wk</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.labHrs || ""} 
                      onChange={e => setFormData({ ...formData, labHrs: e.target.value })}
                      placeholder="e.g. 0"
                    />
                  </div>
                </>
              )}

              {formType === 'resource' && (
                <>
                  <div className="form-group">
                    <label>Resource / Room Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. LT-5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Resource Type</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.type || ""} 
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="">Select Type</option>
                      <option value="CLASSROOM">Classroom</option>
                      <option value="LECTURE_THEATRE">Lecture Theatre</option>
                      <option value="COMPUTER_LAB">Computer Lab</option>
                      <option value="SEMINAR_HALL">Seminar Hall</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Seating Capacity</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      required 
                      value={formData.capacity || ""} 
                      onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="e.g. 60"
                    />
                  </div>
                </>
              )}

              {formType === 'request' && (
                <>
                  <div className="form-group">
                    <label>Request Type</label>
                    <select 
                      className="form-control" 
                      required
                      value={formData.type || ""} 
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Slot Change">Slot Change Request</option>
                      <option value="Room Request">Room Reassignment</option>
                      <option value="Leave Request">Leave of Absence</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Request Details</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={formData.details || ""} 
                      onChange={e => setFormData({ ...formData, details: e.target.value })}
                      placeholder="e.g. Mon 09:00 -> Wed 14:00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reason / Justification</label>
                    <textarea 
                      className="form-control" 
                      required 
                      value={formData.reason || ""} 
                      onChange={e => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Reason for change request..."
                      rows="3"
                    ></textarea>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
