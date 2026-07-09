const fs = require('fs');
let c = fs.readFileSync('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\App.jsx', 'utf8');
c = c.replace(/\r\n/g, '\n');

const target = `        academicCatalog={academicCatalog} setAcademicCatalog={setAcademicCatalog}\n        currentUser={currentUser}\n        setView={setView}\n      />}`;

const replacement = `        academicCatalog={academicCatalog} setAcademicCatalog={setAcademicCatalog}
        academicApprovals={academicApprovals} setAcademicApprovals={setAcademicApprovals}
        alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications}
        alumniCardForms={alumniCardForms} setAlumniCardForms={setAlumniCardForms}
      />}
      {view === 'organization' && <OrganizationChart setView={setView} />}
      {view === 'jobs' && <JobsAndInternships setView={setView} jobs={jobs} applications={applications} setApplications={setApplications} currentUser={currentUser} userRole={userRole} />}
      {view === 'haberler' && <NewsEvents setView={setView} category="haberler" news={news} announcements={announcements} events={events} currentUser={currentUser} userRole={userRole} />}
      {view === 'duyurular' && <NewsEvents setView={setView} category="duyurular" news={news} announcements={announcements} events={events} currentUser={currentUser} userRole={userRole} />}
      {view === 'etkinlikler' && <NewsEvents setView={setView} category="etkinlikler" news={news} announcements={announcements} events={events} currentUser={currentUser} userRole={userRole} />}
      {view === 'sem' && <SemPanel setView={setView} semCourses={semCourses} />}
      {view === 'staj' && <StajPanel setView={setView} />}
      {view === 'profile_update' && <ProfileUpdate 
        setView={setView} 
        currentUser={currentUser} setCurrentUser={setCurrentUser}
        userRole={userRole} 
        academicCatalog={academicCatalog} 
        academicApprovals={academicApprovals} setAcademicApprovals={setAcademicApprovals} 
        students={students} setStudents={setStudents}
        alumni={alumni} setAlumni={setAlumni}
        academicStaff={academicStaff} setAcademicStaff={setAcademicStaff}
        companies={companies} setCompanies={setCompanies}
      />}
      {view === 'user_profile' && <UserProfile 
        userId={selectedUserId} 
        setView={setView} 
        students={liveStudents} 
        alumni={liveAlumni} 
        companies={liveCompanies} 
        academicStaff={liveAcademicStaff} 
        currentUser={currentUser}
        userRole={userRole}
      />}
      {view === 'group_profile' && <GroupProfile
        groupId={selectedGroupId}
        groupData={{}}
        posts={posts}
        setPosts={setPosts}
        currentUser={currentUser}
        setView={setView}
      />}`;

if (c.includes(target)) {
    c = c.replace(target, replacement);
    fs.writeFileSync('C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\App.jsx', c);
    console.log("Restored App.jsx successfully!");
} else {
    console.log("Could not find the target string.");
}
