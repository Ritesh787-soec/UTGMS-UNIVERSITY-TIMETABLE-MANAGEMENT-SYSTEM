import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, User, Eye, EyeOff, Book, Layers, Cpu, HelpCircle, FileText, 
  Sun, Moon, Shield, Bell, Settings, Search, CheckCircle, 
  XCircle, Plus, Edit, Trash, Lock, Unlock, ArrowLeftRight, 
  Download, AlertTriangle, RefreshCw, LogIn, LogOut, Check, ArrowRight
} from 'lucide-react';

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
  const [theme, setTheme] = useState("dark");
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
      const user = INITIAL_USERS.find(u => u.email === loginEmail);
      if (user && (
        (loginPassword === "admin123" && user.role === "ADMIN") ||
        (loginPassword === "coord123" && user.role === "COORDINATOR") ||
        (loginPassword === "faculty123" && user.role === "FACULTY")
      )) {
        setCurrentUser(user);
        setOfflineMode(true);
        logActivity(user.email, "User Login", `Logged in successfully (Offline Mock Mode)`);
      } else {
        setLoginError("Invalid email or password credentials.");
      }
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

      setTimetableEntries(updated);
      logActivity(currentUser.email, "Slot Modify", `Moved ${srcEntry.subject} from ${srcDay} Slot ${srcSlot} to ${day} Slot ${slot}`);
      setSelectedCell(null);
    }
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
          <div className="geu-login-header">
            <div className="geu-logo-emblem">
              <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="23" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1"/>
                <circle cx="24" cy="24" r="19" fill="#1e293b"/>
                <circle cx="24" cy="24" r="14" fill="#8a1538"/>
                <path d="M24 15C19 15 17 21 17 25C17 31 22 33 24 33C26 33 31 31 31 25C31 21 29 15 24 15Z" fill="#ffffff"/>
                <circle cx="24" cy="24" r="5" fill="#8a1538"/>
              </svg>
            </div>
            <div className="geu-logo-text">
              <span className="geu-logo-title">
                <span className="red">Graphic</span>
                <span className="dark">Era</span>
              </span>
              <span className="geu-logo-subtitle">Deemed to be University</span>
            </div>
          </div>

          <div className="geu-login-body">
            {/* Quick Autofill Role Selector */}
            <div className="geu-autofill-section">
              <div className="geu-autofill-title">Select Role for Quick Autofill:</div>
              <div className="role-select-grid">
                <div className={`role-pill ${loginEmail === 'admin@college.com' ? 'selected' : ''}`} onClick={() => { setLoginEmail('admin@college.com'); setLoginPassword('admin123'); }}>Admin</div>
                <div className={`role-pill ${loginEmail === 'coordinator@college.com' ? 'selected' : ''}`} onClick={() => { setLoginEmail('coordinator@college.com'); setLoginPassword('coord123'); }}>Coordinator</div>
                <div className={`role-pill ${loginEmail === 'faculty@college.com' ? 'selected' : ''}`} onClick={() => { setLoginEmail('faculty@college.com'); setLoginPassword('faculty123'); }}>Faculty</div>
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
          <span>UniSched Admin</span>
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

            <button className="icon-btn">
              <Bell size={20} />
              <div className="badge"></div>
            </button>
            
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

        {/* Content Area */}
        <main className="page-container">
          
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
            </>
          )}

          {/* ==========================================
              TAB: VERSION CONTROL (TIMETABLE COMPARISON)
              ========================================== */}
          {currentTab === 'version-control' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Version Control & Timetable comparison</h1>
                  <p className="page-subtitle">Review draft revisions and approve modifications.</p>
                </div>
                {currentUser.role !== 'FACULTY' && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={() => alert("Restoring to v1.2 configuration...")}>
                      <RefreshCw size={16} /> Rollback to v1.2
                    </button>
                    <button className="btn btn-primary" onClick={() => alert("Current draft approved and published as official timetable!")}>
                      <CheckCircle size={16} /> Approve Current (v1.3)
                    </button>
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
                                style={{ 
                                  cursor: currentUser.role !== 'FACULTY' ? 'pointer' : 'default',
                                  backgroundColor: selectedCell?.day === day && selectedCell?.slot === slot ? 'var(--primary-light)' : 'transparent'
                                }}
                              >
                                {item ? (
                                  <div className={`lecture-card ${item.locked ? 'locked' : ''}`}>
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
                              <td key={slot}>
                                {item ? (
                                  <div className="lecture-card">
                                    <div className="lecture-subject">{item.subject}</div>
                                    <div className="lecture-faculty">{item.faculty}</div>
                                    <div className="lecture-room">{item.room}</div>
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
                        {currentUser.role !== 'FACULTY' && <th>Actions</th>}
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
                          {currentUser.role !== 'FACULTY' && (
                            <td>
                              {req.status === 'PENDING' ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                    className="btn btn-success" 
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                    onClick={() => handleProcessRequest(req.id, "APPROVED")}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="btn btn-danger" 
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                    onClick={() => handleProcessRequest(req.id, "REJECTED")}
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processed</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

                  {genReport && (
                    <div style={{ 
                      backgroundColor: 'var(--success-light)', 
                      border: '1px solid var(--success)', 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-lg)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                      fontSize: '0.8rem'
                    }}>
                      <div>Lectures Placed: <strong>{genReport.placed}</strong></div>
                      <div>Unresolved Conflicts: <strong>{genReport.conflicts}</strong></div>
                      <div>Faculty Utilization: <strong>{genReport.facultyUtil}%</strong></div>
                      <div>Room Utilization: <strong>{genReport.roomUtil}%</strong></div>
                    </div>
                  )}
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
