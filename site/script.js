// Function to format the ISO date string into a more readable format
function formatCommitTime(isoTime) {
    const date = new Date(isoTime);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options); 
}

// Function to fetch the latest commit data for a single repository
async function fetchLatestCommit(repoPath, rowElement) {
    const apiUrl = `https://api.github.com/repos/${repoPath}/commits?per_page=1`;
    
    try {
        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'Jarran-Workbench-App' }
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
            rowElement.querySelector('.last-commit-time').textContent = 'No commits found.';
            return;
        }

        // Get the relevant data from the first (latest) commit
        const latestCommit = data[0];
        const commitTime = latestCommit.commit.author.date;
        const repoUrl = `https://github.com/${repoPath}`;

        // Populate the "Last Commit" field
        const formattedTime = formatCommitTime(commitTime); 
        rowElement.querySelector('.last-commit-time').textContent = formattedTime;

        // Populate the "GitHub Link" field
        const linkCell = rowElement.querySelector('.github-link');
        if (linkCell.innerHTML === '' || linkCell.textContent === 'N/A') {
            linkCell.innerHTML = `<a href="${repoUrl}" target="_blank">View Repo</a>`;
        }

    } catch (error) {
        console.error(`Failed to fetch commits for ${repoPath}:`, error);
        rowElement.querySelector('.last-commit-time').textContent = 'Error fetching data.';
        rowElement.querySelector('.github-link').textContent = 'N/A';
    }
}

// Main function to run when the page loads
function initializeProjectTable() {
    const tableBody = document.getElementById('project-table-body');
    const projectRows = tableBody.querySelectorAll('tr[data-repo]'); 
    
    projectRows.forEach(row => {
        const repoPath = row.getAttribute('data-repo');
        if (repoPath) {
            fetchLatestCommit(repoPath, row);
        }
    });
}

// Start the process when the entire document is loaded
document.addEventListener('DOMContentLoaded', initializeProjectTable);