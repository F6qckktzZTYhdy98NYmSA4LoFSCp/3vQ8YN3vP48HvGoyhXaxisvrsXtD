import React, { useEffect } from 'react';
import { allRoles } from '../data/roles';
import { workerPostClientLog } from '@/api/workerPostClientLog';

// Sample data for the organizational chart
function getRandomDateWithinLastFourMonths() {
  const now = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(now.getMonth() - 4);
  const randomDate = new Date(fourMonthsAgo.getTime() + Math.random() * (now.getTime() - fourMonthsAgo.getTime()));
  return randomDate.toLocaleDateString();
}

const orgChart = allRoles.map((role, index) => ({
  name: role.name,
  role: role.title,
  department: role.department,
  completion: [75, 50, 90, 60, 80][index % 5], // Fixed completion percentages for testing
  image: role.image,
  lastLogin: getRandomDateWithinLastFourMonths(),
})).sort((a, b) => b.completion - a.completion);


const departmentAverages = ['Operations', 'Engineering', 'Finance'].map(department => {
  const rolesInDepartment = orgChart.filter(role => role.department === department);
  const averageCompletion = rolesInDepartment.reduce((sum, role) => sum + role.completion, 0) / rolesInDepartment.length;
  return { department, averageCompletion };
});

// console.log('Department Averages:', departmentAverages);

const departmentColors: Record<string, string> = {
  'Operations': '#4caf50', // Green
  'Engineering': '#2196f3', // Blue
  'Finance': '#ff9800', // Orange
};

export const Leaderboard: React.FC = () => {

  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'leaderboard_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);

  return (
    <div className='max-h-[95%]' style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', overflowY: 'auto' }}>
      <h1 style={{ fontWeight: 'bold', marginBottom: '10px' }}>NexusForge Leaderboard</h1>
      <hr style={{ border: 'none', borderTop: '2px solid #000', marginBottom: '20px' }} />
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em' }}>Average Percentage Completion by Department</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '350px', padding: '20px', border: '1px solid lightblue', borderRadius: '5px', overflow: 'visible', backgroundColor: 'transparent' }}>
          {departmentAverages.map((dept, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ height: `${dept.averageCompletion * 3.5}px`, width: '50px', backgroundColor: departmentColors[dept.department], border: '1px solid black', margin: '0 auto' }}></div>
              <strong>{dept.department}</strong>
              <div>{dept.averageCompletion.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>
      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ddd' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Employee</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>% Complete</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {orgChart.map((person, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', alignItems: 'center' }}>
                <img src={person.image} alt={person.name} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                {person.name}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.role}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.department}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.completion}%</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
