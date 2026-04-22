import { useState, useEffect, useRef, useCallback } from "react";

// ─── EMBEDDED QUESTION BANK ──────────────────────────────────────────────────
const QUESTION_BANK = {
  excel: {
    beginner: [
      { id: "e1", type: "mcq", question: "Which function returns the sum of a range of cells?", options: ["=TOTAL(A1:A10)", "=SUM(A1:A10)", "=ADD(A1:A10)", "=PLUS(A1:A10)"], answer: 1, xp: 10, explanation: "=SUM() is the correct function for adding up a range of cells in Excel." },
      { id: "e2", type: "fill", question: "To count cells that contain numbers, use the ______ function.", answer: "COUNT", xp: 10, hint: "It starts with C and has 5 letters." },
      { id: "e3", type: "mcq", question: "What does the VLOOKUP function do?", options: ["Searches vertically in a table", "Adds values in a column", "Sorts data alphabetically", "Counts non-empty cells"], answer: 0, xp: 10, explanation: "VLOOKUP searches for a value in the first column of a table array and returns a value from another column." },
      { id: "e4", type: "mcq", question: "Which keyboard shortcut creates a new worksheet?", options: ["Ctrl+N", "Ctrl+W", "Shift+F11", "Alt+F4"], answer: 2, xp: 10, explanation: "Shift+F11 inserts a new worksheet in Excel." },
      { id: "e5", type: "fill", question: "The formula =A1*______ multiplies A1 by 100.", answer: "100", xp: 10, hint: "Just enter the number." },
    ],
    intermediate: [
      { id: "e6", type: "mcq", question: "What is a Pivot Table used for?", options: ["Drawing charts", "Summarizing large datasets", "Formatting cells", "Printing spreadsheets"], answer: 1, xp: 20, explanation: "Pivot Tables let you summarize, analyze, explore, and present your data." },
      { id: "e7", type: "fill", question: "=IF(A1>10, \"High\", ______) returns 'Low' when A1 is not greater than 10.", answer: '"Low"', xp: 20, hint: 'Include the quotes.' },
      { id: "e8", type: "mcq", question: "Which function combines the content of multiple cells?", options: ["=JOIN()", "=MERGE()", "=CONCATENATE()", "=COMBINE()"], answer: 2, xp: 20, explanation: "CONCATENATE (or & operator) joins text from multiple cells together." },
      { id: "e9", type: "mcq", question: "What does $ do in a cell reference like $A$1?", options: ["Formats as currency", "Makes it an absolute reference", "Protects the cell", "Adds the cell value"], answer: 1, xp: 20, explanation: "$ locks a row or column reference, making it absolute so it doesn't shift when copied." },
      { id: "e10", type: "fill", question: "To remove spaces from both ends of text, use the ______ function.", answer: "TRIM", xp: 20, hint: "Think of trimming the edges." },
    ],
    advanced: [
      { id: "e11", type: "mcq", question: "What is the purpose of the INDEX-MATCH combination?", options: ["It creates pivot tables faster", "It is a more flexible lookup than VLOOKUP", "It formats index columns", "It matches cell colors"], answer: 1, xp: 30, explanation: "INDEX-MATCH can look up values in any direction and is not limited to the first column like VLOOKUP." },
      { id: "e12", type: "fill", question: "The ______ function returns the rank of a number in a list.", answer: "RANK", xp: 30, hint: "Think of competition standings." },
      { id: "e13", type: "mcq", question: "Which function calculates the net present value of an investment?", options: ["=RETURN()", "=NPV()", "=PV()", "=INVEST()"], answer: 1, xp: 30, explanation: "=NPV() calculates net present value based on a discount rate and series of future cash flows." },
    ],
    expert: [
      { id: "e14", type: "mcq", question: "What is Power Query used for in Excel?", options: ["Creating macros", "ETL — importing, transforming, and loading data", "Formatting large tables", "Building pivot charts"], answer: 1, xp: 50, explanation: "Power Query is Excel's ETL (Extract, Transform, Load) tool for data preparation." },
      { id: "e15", type: "fill", question: "VBA stands for Visual Basic for ______.", answer: "Applications", xp: 50, hint: "It's a Microsoft programming environment." },
    ],
  },
  sql: {
    beginner: [
      { id: "s1", type: "code", question: "Write a SQL query to select ALL columns from a table called 'employees'.", answer: "SELECT * FROM employees", xp: 10, explanation: "SELECT * retrieves all columns. FROM specifies the table.", hint: "Use the asterisk wildcard." },
      { id: "s2", type: "mcq", question: "Which SQL clause filters rows based on a condition?", options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"], answer: 1, xp: 10, explanation: "WHERE filters rows before grouping. HAVING filters after GROUP BY." },
      { id: "s3", type: "fill", question: "To sort results in descending order, use ORDER BY column ______.", answer: "DESC", xp: 10, hint: "Opposite of ASC." },
      { id: "s4", type: "mcq", question: "What does SELECT DISTINCT do?", options: ["Selects random rows", "Removes duplicate rows from results", "Selects only NULL values", "Counts distinct values"], answer: 1, xp: 10, explanation: "DISTINCT eliminates duplicate rows from the result set." },
      { id: "s5", type: "code", question: "Write a query to get 'name' and 'salary' from 'employees' where salary > 50000.", answer: "SELECT name, salary FROM employees WHERE salary > 50000", xp: 15, explanation: "Combine SELECT with specific columns and WHERE for filtering.", hint: "Specify the columns and add a WHERE condition." },
    ],
    intermediate: [
      { id: "s6", type: "mcq", question: "Which JOIN returns all rows from both tables, matched where possible?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: 3, xp: 20, explanation: "FULL OUTER JOIN returns all rows from both tables, with NULLs where there's no match." },
      { id: "s7", type: "fill", question: "________ BY groups rows that have the same values in specified columns.", answer: "GROUP", xp: 20, hint: "Think of categorizing data." },
      { id: "s8", type: "code", question: "Count the number of employees in each department. Use table 'employees' with columns 'department' and 'id'.", answer: "SELECT department, COUNT(id) FROM employees GROUP BY department", xp: 25, explanation: "Use COUNT() with GROUP BY to aggregate per group.", hint: "Use COUNT() and GROUP BY together." },
      { id: "s9", type: "mcq", question: "Which aggregate function finds the highest value?", options: ["MAX()", "TOP()", "HIGHEST()", "PEAK()"], answer: 0, xp: 20, explanation: "MAX() returns the maximum value in a column." },
    ],
    advanced: [
      { id: "s10", type: "mcq", question: "What is a subquery?", options: ["A backup query", "A query nested inside another query", "A stored procedure", "A query that runs automatically"], answer: 1, xp: 30, explanation: "A subquery is a query within a query, used in WHERE, FROM, or SELECT clauses." },
      { id: "s11", type: "fill", question: "A ______ is a virtual table based on the result of a SQL query.", answer: "VIEW", xp: 30, hint: "It's like a saved query you can reference like a table." },
      { id: "s12", type: "code", question: "Write a query to get the average salary per department from 'employees', only for departments with avg salary > 60000.", answer: "SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 60000", xp: 35, explanation: "HAVING filters groups after aggregation, unlike WHERE which filters rows.", hint: "Use GROUP BY, AVG(), and HAVING." },
    ],
    expert: [
      { id: "s13", type: "mcq", question: "What are Window Functions in SQL?", options: ["Functions that operate on the browser window", "Functions that perform calculations across a set of table rows related to the current row", "Functions for resizing query results", "Functions that replace GROUP BY"], answer: 1, xp: 50, explanation: "Window functions (ROW_NUMBER, RANK, LAG, LEAD, etc.) perform calculations across related rows without collapsing them." },
      { id: "s14", type: "fill", question: "The ______ clause is used with window functions to define the window frame.", answer: "OVER", xp: 50, hint: "It comes right after the function name." },
    ],
  },
  python: {
    beginner: [
      { id: "p1", type: "mcq", question: "Which library is primarily used for data analysis in Python?", options: ["NumPy", "pandas", "matplotlib", "scikit-learn"], answer: 1, xp: 10, explanation: "pandas is the go-to library for data manipulation and analysis in Python." },
      { id: "p2", type: "fill", question: "In pandas, a ______ is a two-dimensional labeled data structure.", answer: "DataFrame", xp: 10, hint: "It's like a table with rows and columns." },
      { id: "p3", type: "mcq", question: "How do you read a CSV file with pandas?", options: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"], answer: 1, xp: 10, explanation: "pd.read_csv() is the standard function to load CSV files into a DataFrame." },
      { id: "p4", type: "mcq", question: "What does df.shape return?", options: ["The data types of columns", "The number of rows and columns as a tuple", "The column names", "The first 5 rows"], answer: 1, xp: 10, explanation: "df.shape returns (rows, columns) as a tuple." },
      { id: "p5", type: "fill", question: "To display the first 5 rows of a DataFrame df, use df.______().", answer: "head", xp: 10, hint: "Think of the 'head' of the data." },
    ],
    intermediate: [
      { id: "p6", type: "mcq", question: "What does df.groupby('col').mean() do?", options: ["Filters rows where col equals mean", "Groups by col and calculates the mean of other columns", "Sorts by the mean column", "Creates a new column named mean"], answer: 1, xp: 20, explanation: "groupby() splits data into groups, then mean() calculates the average per group." },
      { id: "p7", type: "fill", question: "To drop rows with missing values, use df.______().", answer: "dropna", xp: 20, hint: "NA means Not Available (missing)." },
      { id: "p8", type: "code", question: "Write code to select rows from DataFrame df where column 'age' is greater than 30.", answer: "df[df['age'] > 30]", xp: 20, explanation: "Boolean indexing filters rows based on a condition.", hint: "Use boolean indexing inside []." },
      { id: "p9", type: "mcq", question: "Which method merges two DataFrames like SQL JOIN?", options: ["df.append()", "df.concat()", "df.merge()", "df.join_sql()"], answer: 2, xp: 20, explanation: "df.merge() combines DataFrames based on common columns, similar to SQL JOIN." },
    ],
    advanced: [
      { id: "p10", type: "mcq", question: "What does the apply() function do in pandas?", options: ["Applies a filter", "Applies a function along an axis of the DataFrame", "Applies formatting", "Applies sorting"], answer: 1, xp: 30, explanation: "apply() allows you to run a function on each row or column of a DataFrame." },
      { id: "p11", type: "fill", question: "To reshape data from wide to long format, use pd.______().", answer: "melt", xp: 30, hint: "Think of melting a wide table into a tall one." },
      { id: "p12", type: "code", question: "Create a pivot table from df with 'category' as index, 'month' as columns, 'sales' as values using mean.", answer: "df.pivot_table(values='sales', index='category', columns='month', aggfunc='mean')", xp: 35, explanation: "pivot_table() is a powerful method for reshaping and aggregating data.", hint: "Use pivot_table() with values, index, columns, and aggfunc." },
    ],
    expert: [
      { id: "p13", type: "mcq", question: "What is vectorization in pandas?", options: ["Converting data to vectors for ML", "Applying operations to entire arrays at once instead of loops", "Visualizing vector data", "Using NumPy vectors"], answer: 1, xp: 50, explanation: "Vectorization applies operations to entire arrays at once, making code much faster than Python loops." },
      { id: "p14", type: "fill", question: "The ______ library is used for fast array computing that powers pandas.", answer: "NumPy", xp: 50, hint: "It starts with Num..." },
    ],
  },
  powerbi: {
    beginner: [
      { id: "b1", type: "mcq", question: "What does DAX stand for?", options: ["Data Analysis Expressions", "Dashboard Axis Extension", "Data Aggregation XML", "Dynamic Analysis Exchange"], answer: 0, xp: 10, explanation: "DAX (Data Analysis Expressions) is the formula language used in Power BI, Excel Power Pivot, and SSAS." },
      { id: "b2", type: "fill", question: "A ______ is a collection of related tables in Power BI connected by relationships.", answer: "data model", xp: 10, hint: "Think of the structure that holds your data." },
      { id: "b3", type: "mcq", question: "Which view in Power BI shows the relationships between tables?", options: ["Report View", "Data View", "Model View", "Query View"], answer: 2, xp: 10, explanation: "Model View (previously Relationship View) shows all tables and their connections." },
      { id: "b4", type: "mcq", question: "What is a Measure in Power BI?", options: ["A physical ruler tool", "A calculated value that aggregates data dynamically", "A fixed column added to a table", "A data type for numbers"], answer: 1, xp: 10, explanation: "Measures are dynamic calculations that respond to the context of your report (filters, slicers, etc.)." },
      { id: "b5", type: "fill", question: "The DAX function ______ counts the number of rows in a table.", answer: "COUNTROWS", xp: 10, hint: "It literally describes what it does: count the rows." },
    ],
    intermediate: [
      { id: "b6", type: "mcq", question: "What is the difference between a Measure and a Calculated Column?", options: ["There is no difference", "Measures are calculated at query time; Calculated Columns are stored in the table", "Calculated Columns use Python; Measures use DAX", "Measures are for numbers; Calculated Columns are for text"], answer: 1, xp: 20, explanation: "Calculated Columns are computed when data refreshes and stored row by row. Measures are computed on-the-fly based on filter context." },
      { id: "b7", type: "fill", question: "The CALCULATE function changes the ______ context of a DAX expression.", answer: "filter", xp: 20, hint: "It modifies how data is filtered during calculation." },
      { id: "b8", type: "mcq", question: "What does a Slicer do in Power BI?", options: ["Cuts irrelevant data permanently", "Provides a visual filter that users can interact with", "Slices a table into smaller tables", "Removes duplicate values"], answer: 1, xp: 20, explanation: "Slicers are on-canvas visual filters that let report users interactively filter all visuals on the page." },
    ],
    advanced: [
      { id: "b9", type: "mcq", question: "What is Row-Level Security (RLS) in Power BI?", options: ["Securing individual rows with passwords", "Restricting data access for specific users based on defined roles", "Encrypting row data during export", "Preventing row deletion"], answer: 1, xp: 30, explanation: "RLS restricts data access at the row level. You define rules so users only see data relevant to them." },
      { id: "b10", type: "fill", question: "The DAX function ______ evaluates an expression for each row of a table and returns a new table.", answer: "FILTER", xp: 30, hint: "It literally filters a table row by row." },
    ],
    expert: [
      { id: "b11", type: "mcq", question: "What is the purpose of the CALCULATE function's ALL() modifier?", options: ["Calculates all rows at once", "Removes all filters from the specified table or column", "Includes all tables in calculation", "Runs all measures simultaneously"], answer: 1, xp: 50, explanation: "ALL() is used inside CALCULATE to remove filters, useful for calculating percentages of total (ratio to ALL)." },
      { id: "b12", type: "fill", question: "In Power BI, ______ is the process of connecting to and transforming data before it loads into the model.", answer: "Power Query", xp: 50, hint: "It's the ETL layer in Power BI." },
    ],
  },
};

const SKILLS = {
  excel: { name: "Excel", icon: "📊", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  sql: { name: "SQL", icon: "🗄️", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  python: { name: "Python", icon: "🐍", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  powerbi: { name: "Power BI", icon: "⚡", color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
};

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const LEVEL_META = {
  beginner: { label: "Beginner", icon: "🌱", xpReq: 0, color: "#22c55e" },
  intermediate: { label: "Intermediate", icon: "🔥", xpReq: 50, color: "#f59e0b" },
  advanced: { label: "Advanced", icon: "💎", xpReq: 150, color: "#3b82f6" },
  expert: { label: "Expert", icon: "👑", xpReq: 300, color: "#ec4899" },
};

const BADGES = [
  { id: "first_blood", name: "First Blood", icon: "🩸", desc: "Complete your first quiz", req: (u) => u.completedQuizzes >= 1 },
  { id: "explorer", name: "Explorer", icon: "🧭", desc: "Try 3 different skills", req: (u) => new Set(u.skillsPlayed || []).size >= 3 },
  { id: "streak3", name: "On Fire", icon: "🔥", desc: "3-day streak", req: (u) => u.streak >= 3 },
  { id: "xp100", name: "Century", icon: "💯", desc: "Earn 100 XP", req: (u) => u.xp >= 100 },
  { id: "xp500", name: "Veteran", icon: "⚔️", desc: "Earn 500 XP", req: (u) => u.xp >= 500 },
  { id: "master", name: "Master", icon: "👑", desc: "Reach Expert level in any skill", req: (u) => (u.skillXP && Object.values(u.skillXP).some(x => x >= 300)) },
  { id: "perfectionist", name: "Perfectionist", icon: "✨", desc: "Score 100% in a quiz", req: (u) => u.hasPerfectScore },
];

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { name: "DataWizard_99", xp: 1240, streak: 15, avatar: "🧙" },
  { name: "SQLNinja", xp: 980, streak: 8, avatar: "🥷" },
  { name: "PythonPro", xp: 875, streak: 12, avatar: "🐍" },
  { name: "ExcelKing", xp: 720, streak: 6, avatar: "👑" },
  { name: "BI_Master", xp: 650, streak: 4, avatar: "⚡" },
  { name: "DataDriven", xp: 510, streak: 9, avatar: "📊" },
  { name: "QueryQueen", xp: 430, streak: 3, avatar: "👸" },
  { name: "PandasBear", xp: 380, streak: 7, avatar: "🐼" },
  { name: "TableTurner", xp: 290, streak: 2, avatar: "🎲" },
  { name: "RowRider", xp: 210, streak: 1, avatar: "🏇" },
];

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DataQuest() {
  const [screen, setScreen] = useState("login"); // login | dashboard | skill | quiz | result | leaderboard | admin | profile
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => storage.get("dq_users") || []);
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(null);
  const [dailyDone, setDailyDone] = useState(false);

  // Persist users
  useEffect(() => { storage.set("dq_users", users); }, [users]);
  // Auto-login
  useEffect(() => {
    const saved = storage.get("dq_session");
    if (saved) {
      const u = users.find(u => u.email === saved);
      if (u) { setUser(u); setScreen("dashboard"); }
    }
  }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      setUsers(us => us.map(u => u.email === updated.email ? updated : u));
      return updated;
    });
  }, []);

  const checkBadges = useCallback((u) => {
    const earned = BADGES.filter(b => b.req(u) && !(u.badges || []).includes(b.id));
    if (earned.length > 0) {
      const newBadges = [...(u.badges || []), ...earned.map(b => b.id)];
      updateUser({ badges: newBadges });
      setShowBadgeUnlock(earned[0]);
      setTimeout(() => setShowBadgeUnlock(null), 3500);
    }
  }, [updateUser]);

  const handleLogin = (email, password, isRegister) => {
    if (isRegister) {
      if (users.find(u => u.email === email)) { notify("Email already exists!", "error"); return; }
      const newUser = {
        email, password, name: email.split("@")[0],
        xp: 0, streak: 0, lastActive: null,
        completedLevels: {}, completedQuizzes: 0,
        skillXP: { excel: 0, sql: 0, python: 0, powerbi: 0 },
        skillsPlayed: [], badges: [], hasPerfectScore: false,
        recentActivity: [], isAdmin: false,
      };
      const newUsers = [...users, newUser];
      setUsers(newUsers);
      storage.set("dq_users", newUsers);
      setUser(newUser);
      storage.set("dq_session", email);
      setScreen("dashboard");
      notify("Welcome to DataQuest! 🎉");
    } else {
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) { notify("Invalid credentials!", "error"); return; }
      // Streak logic
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let streak = found.streak || 0;
      if (found.lastActive === yesterday) streak += 1;
      else if (found.lastActive !== today) streak = 1;
      const updated = { ...found, streak, lastActive: today };
      setUsers(us => us.map(u => u.email === email ? updated : u));
      setUser(updated);
      storage.set("dq_session", email);
      setScreen("dashboard");
    }
  };

  const handleLogout = () => {
    storage.del("dq_session");
    setUser(null);
    setScreen("login");
  };

  const startQuiz = (skill, level) => {
    const qs = QUESTION_BANK[skill][level];
    if (!qs || qs.length === 0) { notify("No questions available!", "error"); return; }
    setActiveSkill(skill);
    setActiveLevel(level);
    setQuizState({
      questions: qs,
      current: 0,
      answers: [],
      score: 0,
      totalXP: 0,
      startTime: Date.now(),
      hintUsed: false,
      showHint: false,
      showExplanation: false,
      answered: false,
      selectedOption: null,
      textInput: "",
    });
    setScreen("quiz");
  };

  const handleAnswer = (answer) => {
    const q = quizState.questions[quizState.current];
    let correct = false;
    if (q.type === "mcq") correct = answer === q.answer;
    else if (q.type === "fill" || q.type === "code") {
      correct = answer.trim().toLowerCase() === q.answer.toLowerCase();
    }
    setQuizState(prev => ({
      ...prev,
      answered: true,
      selectedOption: answer,
      answers: [...prev.answers, { answer, correct }],
      score: prev.score + (correct ? 1 : 0),
      totalXP: prev.totalXP + (correct ? (prev.hintUsed ? Math.floor(q.xp / 2) : q.xp) : 0),
    }));
  };

  const handleNext = () => {
    const { current, questions } = quizState;
    if (current + 1 >= questions.length) {
      finishQuiz();
    } else {
      setQuizState(prev => ({ ...prev, current: prev.current + 1, answered: false, selectedOption: null, textInput: "", showHint: false, hintUsed: false, showExplanation: false }));
    }
  };

  const finishQuiz = () => {
    const { totalXP, score, questions } = quizState;
    const perfect = score === questions.length;
    const activity = { skill: activeSkill, level: activeLevel, xp: totalXP, score, total: questions.length, date: new Date().toLocaleDateString() };
    const newSkillXP = { ...user.skillXP, [activeSkill]: (user.skillXP[activeSkill] || 0) + totalXP };
    const newSkillsPlayed = [...new Set([...(user.skillsPlayed || []), activeSkill])];
    const completedKey = `${activeSkill}_${activeLevel}`;
    const newCompleted = { ...user.completedLevels, [completedKey]: true };
    const newActivity = [activity, ...(user.recentActivity || [])].slice(0, 10);
    const updates = {
      xp: user.xp + totalXP,
      skillXP: newSkillXP,
      skillsPlayed: newSkillsPlayed,
      completedLevels: newCompleted,
      completedQuizzes: (user.completedQuizzes || 0) + 1,
      recentActivity: newActivity,
      hasPerfectScore: user.hasPerfectScore || perfect,
    };
    updateUser(updates);
    const updatedUser = { ...user, ...updates };
    checkBadges(updatedUser);
    setScreen("result");
  };

  const screens = { login: LoginScreen, dashboard: DashboardScreen, skill: SkillScreen, quiz: QuizScreen, result: ResultScreen, leaderboard: LeaderboardScreen, admin: AdminScreen, profile: ProfileScreen };
  const Screen = screens[screen] || LoginScreen;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0b14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0f1020; } ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes badgePop { 0% { transform:scale(0) rotate(-10deg); opacity:0; } 60% { transform:scale(1.2) rotate(5deg); } 100% { transform:scale(1) rotate(0); opacity:1; } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes xpBurst { 0% { transform:scale(1); } 50% { transform:scale(1.3); } 100% { transform:scale(1); } }
        .animate-in { animation: fadeIn 0.4s ease forwards; }
        .slide-in { animation: slideIn 0.3s ease forwards; }
        .btn { cursor: pointer; border: none; outline: none; transition: all 0.2s; }
        .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; transition: all 0.3s; }
        .card:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }
        input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; border-radius: 10px; padding: 12px 16px; font-family: inherit; font-size: 15px; outline: none; transition: border-color 0.2s; width: 100%; }
        input:focus { border-color: rgba(99,102,241,0.6); background: rgba(255,255,255,0.08); }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .glow { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
        nav { background: rgba(10,11,20,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-btn { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 13px; font-family: inherit; padding: 6px 12px; border-radius: 8px; transition: all 0.2s; }
        .nav-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        .nav-btn.active { background: rgba(99,102,241,0.2); color: #818cf8; }
      `}</style>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: notification.type === "error" ? "rgba(239,68,68,0.9)" : "rgba(34,197,94,0.9)", backdropFilter: "blur(10px)", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, animation: "slideIn 0.3s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          {notification.type === "error" ? "❌ " : "✅ "}{notification.msg}
        </div>
      )}

      {showBadgeUnlock && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div style={{ textAlign: "center", animation: "badgePop 0.5s ease forwards" }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>{showBadgeUnlock.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, color: "#fbbf24", marginBottom: 8 }}>Badge Unlocked!</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#e2e8f0" }}>{showBadgeUnlock.name}</div>
            <div style={{ color: "#94a3b8", marginTop: 8 }}>{showBadgeUnlock.desc}</div>
          </div>
        </div>
      )}

      {user && screen !== "quiz" && <NavBar user={user} screen={screen} setScreen={setScreen} handleLogout={handleLogout} />}

      <Screen
        user={user} users={users} setUsers={setUsers}
        screen={screen} setScreen={setScreen}
        activeSkill={activeSkill} setActiveSkill={setActiveSkill}
        activeLevel={activeLevel}
        quizState={quizState} setQuizState={setQuizState}
        handleLogin={handleLogin} handleLogout={handleLogout}
        startQuiz={startQuiz} handleAnswer={handleAnswer} handleNext={handleNext}
        updateUser={updateUser} notify={notify}
        dailyDone={dailyDone} setDailyDone={setDailyDone}
      />
    </div>
  );
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
function NavBar({ user, screen, setScreen, handleLogout }) {
  return (
    <nav>
      <div className="nav-logo" onClick={() => setScreen("dashboard")} style={{ cursor: "pointer" }}>⚡ DataQuest</div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {[["dashboard", "🏠 Home"], ["leaderboard", "🏆 Leaderboard"], ["profile", "👤 Profile"]].map(([s, label]) => (
          <button key={s} className={`nav-btn ${screen === s ? "active" : ""}`} onClick={() => setScreen(s)}>{label}</button>
        ))}
        {user?.isAdmin && <button className={`nav-btn ${screen === "admin" ? "active" : ""}`} onClick={() => setScreen("admin")}>⚙️ Admin</button>}
        <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600, color: "#818cf8" }}>
            ⚡ {user?.xp || 0} XP
          </div>
          <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600, color: "#fbbf24" }}>
            🔥 {user?.streak || 0}
          </div>
          <button className="nav-btn" onClick={handleLogout} style={{ color: "#f87171" }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ handleLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    handleLogin(email, password, isRegister);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)", filter: "blur(60px)", animation: "float 6s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1), transparent)", filter: "blur(60px)", animation: "float 8s ease-in-out infinite reverse" }} />

      <div className="animate-in" style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>⚡</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>DataQuest</div>
          <div style={{ color: "#64748b", fontSize: 15 }}>Master Data Skills. Earn XP. Dominate the Leaderboard.</div>
        </div>

        <div className="card" style={{ padding: 36 }}>
          <div style={{ display: "flex", marginBottom: 28, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4 }}>
            {["Login", "Register"].map((t, i) => (
              <button key={t} className="btn" onClick={() => setIsRegister(i === 1)} style={{ flex: 1, padding: "9px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: (isRegister ? i === 1 : i === 0) ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent", color: (isRegister ? i === 1 : i === 0) ? "#fff" : "#64748b" }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 8 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" onKeyDown={e => e.key === "Enter" && submit(e)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 8 }}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit(e)} />
            </div>
            <button className="btn" onClick={submit} disabled={loading} style={{ marginTop: 8, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "inherit", background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Loading...</> : isRegister ? "🚀 Create Account" : "⚡ Login"}
            </button>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#475569" }}>
            Demo: use any email/password to register, then login
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
          {Object.entries(SKILLS).map(([k, s]) => (
            <div key={k} style={{ textAlign: "center", fontSize: 28, animation: "float 3s ease-in-out infinite", animationDelay: `${Object.keys(SKILLS).indexOf(k) * 0.5}s` }}>{s.icon}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ user, setScreen, setActiveSkill, startQuiz, dailyDone, setDailyDone }) {
  const totalXPNeeded = 600;
  const userRank = MOCK_LEADERBOARD.filter(u => u.xp > user.xp).length + 1;

  const getDailyChallenge = () => {
    const skills = Object.keys(SKILLS);
    const idx = new Date().getDate() % skills.length;
    return { skill: skills[idx], level: "beginner" };
  };
  const daily = getDailyChallenge();

  return (
    <div className="animate-in" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Hero greeting */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: 6 }}>
          Hey, {user.name}! 👋
        </div>
        <div style={{ color: "#64748b", fontSize: 15 }}>Ready to level up your data skills today?</div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total XP", val: user.xp, icon: "⚡", color: "#818cf8", bg: "rgba(99,102,241,0.1)" },
          { label: "Day Streak", val: user.streak, icon: "🔥", color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
          { label: "Rank", val: `#${userRank}`, icon: "🏆", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
          { label: "Badges", val: (user.badges || []).length, icon: "🎖️", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "20px 24px", background: s.bg, borderColor: `${s.color}22`, animation: `slideIn 0.3s ease ${i * 0.05}s forwards`, opacity: 0 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily challenge */}
      <div className="card" style={{ padding: 24, marginBottom: 32, background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))", borderColor: "rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 40, animation: "float 2s ease-in-out infinite" }}>🎯</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Daily Challenge</div>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>{SKILLS[daily.skill].icon} {SKILLS[daily.skill].name} — Beginner Warmup • Bonus 2× XP</div>
          </div>
        </div>
        <button className="btn" onClick={() => { if (!dailyDone) { setDailyDone(true); startQuiz(daily.skill, "beginner"); } }} style={{ padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: "inherit", background: dailyDone ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: dailyDone ? "#34d399" : "#fff", flexShrink: 0 }}>
          {dailyDone ? "✓ Completed!" : "Start Challenge →"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Skills */}
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Choose a Skill</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {Object.entries(SKILLS).map(([key, skill]) => {
              const skillXP = user.skillXP?.[key] || 0;
              const pct = Math.min(100, (skillXP / 300) * 100);
              return (
                <div key={key} className="card" onClick={() => { setActiveSkill(key); setScreen("skill"); }} style={{ padding: 20, cursor: "pointer", borderColor: `${skill.color}22` }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{skill.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{skill.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{skillXP} XP earned</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: skill.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity + Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24, flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>📈 Overall Progress</div>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>Total XP</span>
              <span style={{ fontWeight: 600 }}>{user.xp} / {totalXPNeeded}</span>
            </div>
            <div className="progress-bar" style={{ marginBottom: 16, height: 10 }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, (user.xp / totalXPNeeded) * 100)}%`, background: "linear-gradient(90deg, #6366f1, #ec4899)" }} />
            </div>
            {Object.entries(SKILLS).map(([k, s]) => {
              const xp = user.skillXP?.[k] || 0;
              return (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#94a3b8" }}>{s.icon} {s.name}</span>
                    <span style={{ color: s.color, fontWeight: 600 }}>{xp} XP</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(100, (xp / 300) * 100)}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🕐 Recent Activity</div>
            {(user.recentActivity || []).length === 0 ? (
              <div style={{ color: "#475569", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No activity yet. Start a quiz!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(user.recentActivity || []).slice(0, 4).map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{SKILLS[a.skill]?.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{SKILLS[a.skill]?.name} — {a.level}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{a.date} • {a.score}/{a.total} correct</div>
                      </div>
                    </div>
                    <div style={{ color: "#818cf8", fontWeight: 700, fontSize: 13 }}>+{a.xp} XP</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SKILL SCREEN ─────────────────────────────────────────────────────────────
function SkillScreen({ user, activeSkill, setScreen, startQuiz }) {
  if (!activeSkill) return null;
  const skill = SKILLS[activeSkill];
  const skillXP = user.skillXP?.[activeSkill] || 0;

  return (
    <div className="animate-in" style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <button className="btn" onClick={() => setScreen("dashboard")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>
        ← Back
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>{skill.icon}</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{skill.name}</div>
        <div style={{ color: "#64748b", marginBottom: 16 }}>Your XP in this skill: <span style={{ color: skill.color, fontWeight: 700 }}>{skillXP}</span></div>
        <div className="progress-bar" style={{ maxWidth: 300, margin: "0 auto" }}>
          <div className="progress-fill" style={{ width: `${Math.min(100, (skillXP / 300) * 100)}%`, background: skill.color }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {LEVELS.map((level) => {
          const meta = LEVEL_META[level];
          const unlocked = skillXP >= meta.xpReq;
          const completed = user.completedLevels?.[`${activeSkill}_${level}`];
          const qs = QUESTION_BANK[activeSkill][level] || [];
          return (
            <div key={level} className="card" style={{ padding: 28, opacity: unlocked ? 1 : 0.5, cursor: unlocked ? "pointer" : "not-allowed", borderColor: completed ? `${meta.color}44` : "rgba(255,255,255,0.08)", background: completed ? `${meta.color}0a` : "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}
              onClick={() => unlocked && startQuiz(activeSkill, level)}>
              {completed && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 18 }}>✅</div>}
              {!unlocked && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 18 }}>🔒</div>}
              <div style={{ fontSize: 36, marginBottom: 10 }}>{meta.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{meta.label}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>{qs.length} questions</div>
              {!unlocked && <div className="tag" style={{ background: "rgba(255,255,255,0.06)", color: "#64748b", fontSize: 11 }}>🔒 Requires {meta.xpReq} XP</div>}
              {unlocked && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div className="tag" style={{ background: `${meta.color}20`, color: meta.color }}>
                    {meta.icon} {meta.label}
                  </div>
                  <div className="tag" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>
                    ⚡ {qs.reduce((a, q) => a + q.xp, 0)} XP max
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── QUIZ SCREEN ──────────────────────────────────────────────────────────────
function QuizScreen({ activeSkill, activeLevel, quizState, setQuizState, handleAnswer, handleNext, setScreen }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  const skill = SKILLS[activeSkill];
  const { questions, current, answered, selectedOption, textInput, showHint, showExplanation, totalXP } = quizState;
  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  useEffect(() => {
    if (answered) { clearInterval(timerRef.current); return; }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); if (!answered) handleAnswer("__timeout__"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, answered]);

  const submitText = () => { if (textInput.trim()) handleAnswer(textInput.trim()); };

  const isCorrect = (idx) => answered && q.type === "mcq" && idx === q.answer;
  const isWrong = (idx) => answered && q.type === "mcq" && idx === selectedOption && selectedOption !== q.answer;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0a0b14" }}>
      {/* Quiz nav */}
      <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,11,20,0.95)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn" onClick={() => setScreen("skill")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>✕ Exit</button>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>{skill?.icon} {skill?.name} — {LEVEL_META[activeLevel]?.label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ color: "#818cf8", fontWeight: 700, fontSize: 14 }}>⚡ {totalXP} XP</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{current + 1} / {questions.length}</div>
          <div style={{ padding: "6px 14px", borderRadius: 20, background: timeLeft <= 10 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)", color: timeLeft <= 10 ? "#f87171" : "#94a3b8", fontWeight: 700, fontSize: 14, border: `1px solid ${timeLeft <= 10 ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}` }}>
            ⏱ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${skill?.color}, #8b5cf6)`, width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%`, transition: "width 0.5s ease" }} />
      </div>

      <div className="animate-in" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: 680 }}>
          {/* Question type badge */}
          <div style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <div className="tag" style={{ background: `${skill?.color}20`, color: skill?.color }}>
              {q.type === "mcq" ? "🔘 Multiple Choice" : q.type === "fill" ? "✏️ Fill in Blank" : "💻 Code Challenge"}
            </div>
            <div className="tag" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>⚡ {q.xp} XP</div>
          </div>

          {/* Question */}
          <div className="card" style={{ padding: 28, marginBottom: 20, borderColor: "rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>{q.question}</div>
          </div>

          {/* Answers */}
          {q.type === "mcq" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {q.options.map((opt, i) => (
                <button key={i} className="btn" onClick={() => !answered && handleAnswer(i)}
                  style={{ padding: "16px 20px", borderRadius: 12, textAlign: "left", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: answered ? "default" : "pointer", transition: "all 0.2s", background: isCorrect(i) ? "rgba(34,197,94,0.2)" : isWrong(i) ? "rgba(239,68,68,0.2)" : answered && i === q.answer ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${isCorrect(i) ? "#22c55e" : isWrong(i) ? "#ef4444" : answered && i === q.answer ? "#22c55e44" : "rgba(255,255,255,0.1)"}`, color: isCorrect(i) ? "#4ade80" : isWrong(i) ? "#f87171" : "#e2e8f0" }}>
                  <span style={{ fontWeight: 700, marginRight: 10, opacity: 0.6 }}>{"ABCD"[i]}</span>{opt}
                  {isCorrect(i) && " ✓"}
                  {isWrong(i) && " ✗"}
                </button>
              ))}
            </div>
          )}

          {(q.type === "fill" || q.type === "code") && (
            <div style={{ marginBottom: 20 }}>
              <input
                value={textInput}
                onChange={e => setQuizState(prev => ({ ...prev, textInput: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && !answered && submitText()}
                disabled={answered}
                placeholder={q.type === "code" ? "Type your code here..." : "Type your answer..."}
                style={{ fontSize: 16, padding: "14px 18px", fontFamily: q.type === "code" ? "monospace" : "inherit", background: answered ? (textInput.trim().toLowerCase() === q.answer.toLowerCase() ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)") : "rgba(255,255,255,0.06)", borderColor: answered ? (textInput.trim().toLowerCase() === q.answer.toLowerCase() ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.1)" }}
              />
              {!answered && <button className="btn" onClick={submitText} style={{ marginTop: 12, width: "100%", padding: "13px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "inherit" }}>Submit Answer</button>}
            </div>
          )}

          {/* Hint and explanation */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {!answered && q.hint && (
              <button className="btn" onClick={() => setQuizState(prev => ({ ...prev, showHint: true, hintUsed: true }))} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                💡 Hint (-50% XP)
              </button>
            )}
          </div>

          {showHint && q.hint && (
            <div style={{ padding: "14px 18px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, marginBottom: 16, color: "#fbbf24", fontSize: 14 }}>
              💡 {q.hint}
            </div>
          )}

          {answered && (
            <div className="animate-in">
              {q.explanation && (
                <div style={{ padding: "14px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, marginBottom: 16, color: "#a5b4fc", fontSize: 14 }}>
                  📖 {q.explanation}
                </div>
              )}
              <button className="btn" onClick={handleNext} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "inherit" }}>
                {current + 1 >= questions.length ? "🏁 Finish Quiz" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── RESULT SCREEN ────────────────────────────────────────────────────────────
function ResultScreen({ user, activeSkill, activeLevel, quizState, setScreen }) {
  if (!quizState) return null;
  const { score, questions, totalXP, answers } = quizState;
  const pct = Math.round((score / questions.length) * 100);
  const skill = SKILLS[activeSkill];
  const grade = pct === 100 ? "🌟 Perfect!" : pct >= 80 ? "🔥 Excellent!" : pct >= 60 ? "👍 Good Job!" : pct >= 40 ? "📚 Keep Going!" : "💪 Try Again!";

  return (
    <div className="animate-in" style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>{grade.split(" ")[0]}</div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{grade.slice(2)}</div>
      <div style={{ color: "#64748b", marginBottom: 32 }}>{skill?.icon} {skill?.name} — {LEVEL_META[activeLevel]?.label}</div>

      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 24 }}>
          {[
            { label: "Score", val: `${score}/${questions.length}`, icon: "🎯" },
            { label: "Accuracy", val: `${pct}%`, icon: "📊" },
            { label: "XP Earned", val: `+${totalXP}`, icon: "⚡" },
          ].map((s, i) => (
            <div key={i} style={{ padding: 20, background: "rgba(255,255,255,0.04)", borderRadius: 12 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "#818cf8" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Answer review */}
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#94a3b8" }}>QUESTION REVIEW</div>
          {questions.map((q, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < questions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: 18 }}>{answers[i]?.correct ? "✅" : "❌"}</div>
              <div style={{ flex: 1, fontSize: 13, color: "#94a3b8" }}>{q.question.slice(0, 60)}...</div>
              <div style={{ fontSize: 12, color: answers[i]?.correct ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                {answers[i]?.correct ? `+${q.xp} XP` : "0 XP"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn" onClick={() => setScreen("skill")} style={{ padding: "13px 24px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontWeight: 600, fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>
          ← Back to Levels
        </button>
        <button className="btn" onClick={() => setScreen("dashboard")} style={{ padding: "13px 24px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>
          🏠 Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
function LeaderboardScreen({ user, users }) {
  const combined = [
    ...MOCK_LEADERBOARD,
    ...users.filter(u => u.xp > 0).map(u => ({ name: u.name, xp: u.xp, streak: u.streak, avatar: "🎮", isCurrentUser: u.email === user?.email }))
  ].sort((a, b) => b.xp - a.xp).slice(0, 15);

  const userRank = combined.findIndex(u => u.isCurrentUser) + 1;

  return (
    <div className="animate-in" style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700 }}>Leaderboard</div>
        <div style={{ color: "#64748b", marginTop: 8 }}>Top data scientists this month</div>
        {userRank > 0 && <div style={{ marginTop: 12, color: "#818cf8", fontWeight: 600 }}>Your rank: #{userRank}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {combined.map((u, i) => {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
          const isMe = u.isCurrentUser;
          return (
            <div key={i} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, background: isMe ? "rgba(99,102,241,0.12)" : i < 3 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)", borderColor: isMe ? "rgba(99,102,241,0.3)" : i < 3 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)", animation: `slideIn 0.3s ease ${i * 0.03}s forwards`, opacity: 0 }}>
              <div style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: medal ? 22 : 15, color: "#64748b" }}>{medal || `#${i + 1}`}</div>
              <div style={{ fontSize: 28 }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{u.name}{isMe ? " (You)" : ""}</div>
                <div style={{ fontSize: 12, color: "#475569" }}>🔥 {u.streak} day streak</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#fb923c" : "#818cf8" }}>
                  {u.xp.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>XP</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ user, updateUser }) {
  if (!user) return null;
  const earnedBadges = BADGES.filter(b => (user.badges || []).includes(b.id));
  const lockedBadges = BADGES.filter(b => !(user.badges || []).includes(b.id));

  return (
    <div className="animate-in" style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div className="card" style={{ padding: 32, marginBottom: 24, display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))", borderColor: "rgba(99,102,241,0.2)" }}>
        <div style={{ fontSize: 72, animation: "float 3s ease-in-out infinite" }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.name}</div>
          <div style={{ color: "#64748b", marginBottom: 12 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="tag" style={{ background: "rgba(129,140,248,0.15)", color: "#818cf8" }}>⚡ {user.xp} XP</div>
            <div className="tag" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>🔥 {user.streak} day streak</div>
            <div className="tag" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>🎖️ {earnedBadges.length} badges</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>📊 Skill Progress</div>
          {Object.entries(SKILLS).map(([k, s]) => {
            const xp = user.skillXP?.[k] || 0;
            const lvl = LEVELS.reduce((best, l) => LEVEL_META[l].xpReq <= xp ? l : best, "beginner");
            return (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: LEVEL_META[lvl]?.color }}>{LEVEL_META[lvl]?.label}</span>
                    <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{xp} XP</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, (xp / 300) * 100)}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🎖️ Badges</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {BADGES.map((b) => {
              const earned = (user.badges || []).includes(b.id);
              return (
                <div key={b.id} title={b.desc} style={{ textAlign: "center", padding: "12px 8px", background: earned ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${earned ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"}`, opacity: earned ? 1 : 0.4, cursor: "default" }}>
                  <div style={{ fontSize: 28, marginBottom: 4, filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: earned ? "#a5b4fc" : "#475569" }}>{b.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN SCREEN ─────────────────────────────────────────────────────────────
function AdminScreen({ user, users, notify }) {
  const [tab, setTab] = useState("users");
  if (!user?.isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Admin Access Required</div>
        <div style={{ color: "#64748b" }}>Your account doesn't have admin privileges.</div>
        <div style={{ marginTop: 16, color: "#475569", fontSize: 13 }}>Tip: Set isAdmin: true in localStorage dq_users for your account</div>
      </div>
    );
  }

  const totalQs = Object.values(QUESTION_BANK).reduce((a, skill) => a + Object.values(skill).reduce((b, qs) => b + qs.length, 0), 0);

  return (
    <div className="animate-in" style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>⚙️ Admin Panel</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Users", val: users.length, icon: "👥", color: "#818cf8" },
          { label: "Total Questions", val: totalQs, icon: "❓", color: "#34d399" },
          { label: "Skills", val: 4, icon: "📚", color: "#fbbf24" },
          { label: "Levels", val: 4, icon: "🎮", color: "#f472b6" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["users", "questions"].map(t => (
          <button key={t} className="btn" onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, background: tab === t ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.06)", color: tab === t ? "#fff" : "#94a3b8", cursor: "pointer" }}>
            {t === "users" ? "👥 Users" : "❓ Questions"}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
                {["User", "XP", "Streak", "Quizzes", "Badges"].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{u.email}</div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "#818cf8", fontWeight: 700 }}>{u.xp}</td>
                  <td style={{ padding: "14px 20px", color: "#fb923c" }}>🔥 {u.streak}</td>
                  <td style={{ padding: "14px 20px", color: "#94a3b8" }}>{u.completedQuizzes || 0}</td>
                  <td style={{ padding: "14px 20px", color: "#94a3b8" }}>{(u.badges || []).length}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#475569" }}>No registered users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "questions" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {Object.entries(QUESTION_BANK).map(([skill, levels]) => (
            <div key={skill} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{SKILLS[skill].icon}</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{SKILLS[skill].name}</span>
              </div>
              {Object.entries(levels).map(([lvl, qs]) => (
                <div key={lvl} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{LEVEL_META[lvl]?.icon} {LEVEL_META[lvl]?.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#818cf8" }}>{qs.length} questions</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
