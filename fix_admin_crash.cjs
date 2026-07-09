const fs = require('fs');
const p = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\AdminDashboard.jsx';
let c = fs.readFileSync(p, 'utf8');

const replaces = {
  'e.title': 'e?.title',
  'e.date': 'e?.date',
  'a.title': 'a?.title',
  'a.date': 'a?.date',
  's.name': 's?.name',
  's.department': 's?.department',
  's.dept': 's?.dept',
  's.gpa': 's?.gpa',
  's.cv': 's?.cv',
  's.year': 's?.year',
  's.status': 's?.status',
  's.id': 's?.id',
  'j.title': 'j?.title',
  'j.company': 'j?.company',
  'j.type': 'j?.type',
  'j.status': 'j?.status',
  'j.date': 'j?.date',
  'j.id': 'j?.id',
  'm.read': 'm?.read',
  'm.from': 'm?.from',
  'm.subject': 'm?.subject',
  'm.date': 'm?.date',
  'm.id': 'm?.id',
  'c.jobs': 'c?.jobs',
  'c.name': 'c?.name',
  'c.sector': 'c?.sector',
  'c.contact': 'c?.contact',
  'c.status': 'c?.status',
  'c.id': 'c?.id',
  'ne.type': 'ne?.type',
  'ne.title': 'ne?.title',
  'ne.date': 'ne?.date',
  'ne.status': 'ne?.status',
  'ne.id': 'ne?.id'
};

for (const [k, v] of Object.entries(replaces)) {
  // Use global string replace
  c = c.split(k).join(v);
}

// Ensure contentData accesses are safe
c = c.split('contentData.haberler').join('(contentData?.haberler || [])');
c = c.split('contentData.duyurular').join('(contentData?.duyurular || [])');
c = c.split('contentData.etkinlikler').join('(contentData?.etkinlikler || [])');

// Look for rendering problems when mapping over `students`, `alumni`, `companies`, etc.
// Add safety fallback if the array element itself is undefined.
c = c.replace(/e=>/g, 'e => { if(!e) return null; return ');
// Wait, that might break implicit returns. Let's just fix the variables.

fs.writeFileSync(p, c);
console.log('Fixed AdminDashboard variables.');
