import type {
  Standard,
  Division,
  User,
  Student,
  ActivityLog,
  ActivityCategory,
} from '@/types';

// ─── STANDARDS ───────────────────────────────────────────────────────────────
export const STANDARDS: Standard[] = [
  { id: 'std1', name: 'Standard 1', label: 'Std 1' },
  { id: 'std2', name: 'Standard 2', label: 'Std 2' },
  { id: 'std3', name: 'Standard 3', label: 'Std 3' },
];

// ─── DIVISIONS ────────────────────────────────────────────────────────────────
export const DIVISIONS: Division[] = [
  { id: 'div1a', standardId: 'std1', name: 'A', label: 'Std 1 - Div A', teacherId: 't1' },
  { id: 'div1b', standardId: 'std1', name: 'B', label: 'Std 1 - Div B', teacherId: 't2' },
  { id: 'div1c', standardId: 'std1', name: 'C', label: 'Std 1 - Div C', teacherId: 't3' },
  { id: 'div2a', standardId: 'std2', name: 'A', label: 'Std 2 - Div A', teacherId: 't4' },
  { id: 'div2b', standardId: 'std2', name: 'B', label: 'Std 2 - Div B', teacherId: 't5' },
  { id: 'div2c', standardId: 'std2', name: 'C', label: 'Std 2 - Div C', teacherId: 't6' },
  { id: 'div3a', standardId: 'std3', name: 'A', label: 'Std 3 - Div A', teacherId: 't7' },
  { id: 'div3b', standardId: 'std3', name: 'B', label: 'Std 3 - Div B', teacherId: 't8' },
  { id: 'div3c', standardId: 'std3', name: 'C', label: 'Std 3 - Div C', teacherId: 't9' },
];

// ─── TEACHERS / USERS ─────────────────────────────────────────────────────────
export const TEACHERS: User[] = [
  { id: 't1', name: 'Ms. Ananya Sharma', role: 'teacher', email: 'ananya@spplay.edu', avatarInitials: 'AS', divisionId: 'div1a', standardId: 'std1' },
  { id: 't2', name: 'Ms. Priya Nair', role: 'teacher', email: 'priya@spplay.edu', avatarInitials: 'PN', divisionId: 'div1b', standardId: 'std1' },
  { id: 't3', name: 'Ms. Deepa Iyer', role: 'teacher', email: 'deepa@spplay.edu', avatarInitials: 'DI', divisionId: 'div1c', standardId: 'std1' },
  { id: 't4', name: 'Ms. Kavitha Rao', role: 'teacher', email: 'kavitha@spplay.edu', avatarInitials: 'KR', divisionId: 'div2a', standardId: 'std2' },
  { id: 't5', name: 'Ms. Sunita Pillai', role: 'teacher', email: 'sunita@spplay.edu', avatarInitials: 'SP', divisionId: 'div2b', standardId: 'std2' },
  { id: 't6', name: 'Ms. Rekha Menon', role: 'teacher', email: 'rekha@spplay.edu', avatarInitials: 'RM', divisionId: 'div2c', standardId: 'std2' },
  { id: 't7', name: 'Ms. Nisha Verma', role: 'teacher', email: 'nisha@spplay.edu', avatarInitials: 'NV', divisionId: 'div3a', standardId: 'std3' },
  { id: 't8', name: 'Ms. Geetha Subbu', role: 'teacher', email: 'geetha@spplay.edu', avatarInitials: 'GS', divisionId: 'div3b', standardId: 'std3' },
  { id: 't9', name: 'Ms. Lalitha Bose', role: 'teacher', email: 'lalitha@spplay.edu', avatarInitials: 'LB', divisionId: 'div3c', standardId: 'std3' },
];

export const PRINCIPAL: User = {
  id: 'p1',
  name: 'Mrs. Savitha Krishnan',
  role: 'principal',
  email: 'principal@spplay.edu',
  avatarInitials: 'SK',
};

export const ALL_USERS: User[] = [PRINCIPAL, ...TEACHERS];

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-rose-400','bg-orange-400','bg-amber-400','bg-lime-500',
  'bg-emerald-500','bg-teal-500','bg-cyan-500','bg-sky-500',
  'bg-blue-500','bg-violet-500','bg-purple-500','bg-pink-500',
  'bg-red-400','bg-green-500','bg-indigo-500',
];

const studentNames: Record<string, string[]> = {
  div1a: ['Harsh Patel','Kirthi Reddy','Raksha Singh','Arjun Nair','Meera Das','Rohan Gupta','Sia Kulkarni','Veer Mehta','Anvi Joshi','Diya Shah','Kabir Verma','Tara Pillai','Rishi Rao','Nila Krishnan','Omkar Bhat'],
  div1b: ['Aadi Sharma','Prisha Iyer','Yuvan Pillai','Myra Menon','Sai Bose','Dhruv Patel','Isha Reddy','Krish Nair','Lara Singh','Om Gupta','Pari Kulkarni','Raj Mehta','Sana Joshi','Tej Shah','Uma Verma'],
  div1c: ['Vivaan Das','Wren Rao','Xena Krishnan','Yash Bhat','Zara Sharma','Aarav Iyer','Bhumi Pillai','Chetan Menon','Disha Bose','Ek Patel','Farida Reddy','Gaurav Nair','Hema Singh','Ishan Gupta','Jaya Kulkarni'],
  div2a: ['Karan Mehta','Lakshmi Joshi','Manav Shah','Nandini Verma','Oscar Das','Pavan Rao','Qira Krishnan','Reva Bhat','Samar Sharma','Tanvi Iyer','Uday Pillai','Vani Menon','Waris Bose','Xara Patel','Yuvraj Reddy'],
  div2b: ['Ziya Nair','Arnav Singh','Bela Gupta','Charu Kulkarni','Dev Mehta','Esha Joshi','Faisal Shah','Gauri Verma','Hemant Das','Indira Rao','Jay Krishnan','Kiran Bhat','Leena Sharma','Mohit Iyer','Noor Pillai'],
  div2c: ['Omkar Menon','Pooja Bose','Qasim Patel','Rita Reddy','Siddharth Nair','Trisha Singh','Umesh Gupta','Vanshika Kulkarni','Wasim Mehta','Xenia Joshi','Yash Shah','Zoha Verma','Anant Das','Bhoomi Rao','Chirag Krishnan'],
  div3a: ['Darshan Bhat','Esha Sharma','Farhan Iyer','Geet Pillai','Hardik Menon','Ira Bose','Jayesh Patel','Kavya Reddy','Luv Nair','Mahi Singh','Nikhil Gupta','Ojasvi Kulkarni','Parth Mehta','Qween Joshi','Rajan Shah'],
  div3b: ['Sakshi Verma','Tarun Das','Urvi Rao','Varun Krishnan','Wina Bhat','Xander Sharma','Yara Iyer','Zubin Pillai','Adi Menon','Bindu Bose','Chandan Patel','Deepika Reddy','Edwin Nair','Faiz Singh','Gayatri Gupta'],
  div3c: ['Harsh Kulkarni','Indu Mehta','Jai Joshi','Karuna Shah','Lakhan Verma','Mona Das','Naveen Rao','Onkar Krishnan','Puja Bhat','Quresh Sharma','Radha Iyer','Sundar Pillai','Tina Menon','Usha Bose','Vikas Patel'],
};

export const STUDENTS: Student[] = Object.entries(studentNames).flatMap(
  ([divisionId, names]) => {
    const division = DIVISIONS.find((d) => d.id === divisionId)!;
    return names.map((name, index) => ({
      id: `${divisionId}_s${index + 1}`,
      name,
      divisionId,
      standardId: division.standardId,
      rollNumber: index + 1,
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    }));
  }
);

// ─── ACTIVITY SEED DATA ───────────────────────────────────────────────────────
const ACTIVITY_TEMPLATES: { description: string; category: ActivityCategory; tags: string[] }[] = [
  { description: 'drew a dinosaur with crayons', category: 'Art & Craft', tags: ['drawing','crayons','dinosaur'] },
  { description: 'painted a rainbow on white paper', category: 'Art & Craft', tags: ['painting','rainbow','colors'] },
  { description: 'planted a sunflower seed in the pot', category: 'Nature & Environment', tags: ['planting','sunflower','gardening'] },
  { description: 'watered the school garden plants', category: 'Nature & Environment', tags: ['watering','plants','garden'] },
  { description: 'fed the school cat with biscuits', category: 'Animals & Pets', tags: ['feeding','cat','caring'] },
  { description: 'helped a butterfly trapped in the classroom get outside', category: 'Animals & Pets', tags: ['butterfly','helping','nature'] },
  { description: 'kicked a goal during football practice', category: 'Sports & Play', tags: ['football','goal','sports'] },
  { description: 'finished the obstacle course first today', category: 'Sports & Play', tags: ['obstacle','running','fitness'] },
  { description: 'read an entire picture book aloud to the class', category: 'Reading & Learning', tags: ['reading','book','confidence'] },
  { description: 'solved a 20-piece puzzle independently', category: 'Reading & Learning', tags: ['puzzle','thinking','independent'] },
  { description: 'sang "Twinkle Twinkle" solo during morning assembly', category: 'Music & Dance', tags: ['singing','assembly','confidence'] },
  { description: 'danced to a folk song during cultural hour', category: 'Music & Dance', tags: ['dance','folk','culture'] },
  { description: 'shared tiffin box with a new student', category: 'Helping & Sharing', tags: ['sharing','kindness','friendship'] },
  { description: 'helped tidy up the classroom after art class', category: 'Helping & Sharing', tags: ['helping','cleaning','responsibility'] },
  { description: 'made a bridge using building blocks by herself', category: 'Science & Explore', tags: ['blocks','building','engineering'] },
  { description: 'observed and described how a magnet attracts clips', category: 'Science & Explore', tags: ['magnet','observation','science'] },
  { description: 'made a paper boat and floated it in the tub', category: 'Art & Craft', tags: ['paper','boat','origami'] },
  { description: 'brought a leaf collection for show and tell', category: 'Nature & Environment', tags: ['leaves','collection','show-tell'] },
  { description: 'stroked and named the school rabbit', category: 'Animals & Pets', tags: ['rabbit','pet','school'] },
  { description: 'ran the full length of the playground without stopping', category: 'Sports & Play', tags: ['running','stamina','energy'] },
  { description: 'counted and sorted 50 coloured blocks by colour', category: 'Reading & Learning', tags: ['counting','sorting','math'] },
  { description: 'played the triangle in the percussion band session', category: 'Music & Dance', tags: ['percussion','music','band'] },
  { description: 'gave water to a thirsty visitor in the corridor', category: 'Helping & Sharing', tags: ['empathy','water','kindness'] },
  { description: 'made a simple circuit with a battery and bulb', category: 'Science & Explore', tags: ['circuit','electricity','science'] },
  { description: 'created a collage of animals from magazines', category: 'Art & Craft', tags: ['collage','animals','craft'] },
  { description: 'planted mint cuttings in recycled bottles', category: 'Nature & Environment', tags: ['mint','recycling','planting'] },
  { description: 'gently returned a worm found on the path to the soil', category: 'Animals & Pets', tags: ['worm','caring','soil'] },
  { description: 'scored 3 baskets in ring-toss game', category: 'Sports & Play', tags: ['ring-toss','aim','game'] },
  { description: 'wrote her name in cursive for the first time', category: 'Reading & Learning', tags: ['writing','cursive','milestone'] },
  { description: 'composed a 2-line rhyme about the rain', category: 'Music & Dance', tags: ['rhyme','poem','creativity'] },
];

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

function generateActivities(): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-05-28');

  let counter = 1;

  DIVISIONS.forEach((division) => {
    const teacher = TEACHERS.find((t) => t.id === division.teacherId)!;
    const students = STUDENTS.filter((s) => s.divisionId === division.id);

    // Each student gets 8–14 activities
    students.forEach((student) => {
      const count = 8 + Math.floor(Math.random() * 7);
      for (let i = 0; i < count; i++) {
        const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
        logs.push({
          id: `act${counter++}`,
          studentId: student.id,
          studentName: student.name,
          teacherId: teacher.id,
          teacherName: teacher.name,
          divisionId: division.id,
          standardId: division.standardId,
          description: `${student.name} ${template.description}.`,
          category: template.category,
          timestamp: randomDate(startDate, endDate),
          tags: template.tags,
          edited: Math.random() > 0.9,
        });
      }
    });
  });

  // Sort by timestamp descending
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const ACTIVITY_LOGS: ActivityLog[] = generateActivities();

export const CATEGORY_COLORS: Record<string, string> = {
  'Art & Craft': '#f59e0b',
  'Nature & Environment': '#22c55e',
  'Animals & Pets': '#f97316',
  'Sports & Play': '#3b82f6',
  'Reading & Learning': '#8b5cf6',
  'Music & Dance': '#ec4899',
  'Helping & Sharing': '#14b8a6',
  'Science & Explore': '#06b6d4',
  'General': '#6b7280',
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Art & Craft': '🎨',
  'Nature & Environment': '🌿',
  'Animals & Pets': '🐾',
  'Sports & Play': '⚽',
  'Reading & Learning': '📚',
  'Music & Dance': '🎵',
  'Helping & Sharing': '🤝',
  'Science & Explore': '🔬',
  'General': '📝',
};

export const ALL_CATEGORIES: string[] = [
  'Art & Craft','Nature & Environment','Animals & Pets','Sports & Play',
  'Reading & Learning','Music & Dance','Helping & Sharing','Science & Explore','General',
];
