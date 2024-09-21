document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authSection = document.getElementById('auth-section');
    const fileSection = document.getElementById('file-section');
    const usernameDisplay = document.getElementById('username-display');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const fileList = document.getElementById('fileList');
  
    document.getElementById('show-register-form').addEventListener('click', () => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      document.getElementById('auth-title').innerText = 'Register';
    });
  
    document.getElementById('show-login-form').addEventListener('click', () => {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      document.getElementById('auth-title').innerText = 'Login';
    });
  
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
  
      const mutation = `
        mutation {
          register(username: "${username}", password: "${password}") {
            success
          }
        }
      `;
  
      try {
        const response = await makeGraphQLRequest(mutation);
        console.log(response); // Для отладки, чтобы увидеть структуру ответа
  
        if (response.errors) {
          console.error('GraphQL Error:', response.errors);
          alert('Registration failed due to server error!');
          return;
        }
  
        if (response.data && response.data.register && response.data.register.success) {
          alert('Registration successful! Please login.');
          registerForm.style.display = 'none';
          loginForm.style.display = 'block';
          document.getElementById('auth-title').innerText = 'Login';
        } else {
          alert('Registration failed!');
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    });
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
  
      const mutation = `
        mutation {
          login(username: "${username}", password: "${password}") {
            token
          }
        }
      `;
  
      try {
        const response = await makeGraphQLRequest(mutation);
  
        if (response.errors) {
          console.error('GraphQL Error:', response.errors);
          alert('Login failed due to server error!');
          return;
        }
  
        if (response.data && response.data.login && response.data.login.token) {
          localStorage.setItem('jwtToken', response.data.login.token);
          usernameDisplay.innerText = username;
          authSection.style.display = 'none';
          fileSection.style.display = 'block';
          userInfo.style.display = 'flex';
          loadFiles();
        } else {
          alert('Login failed!');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
  
    logoutBtn.addEventListener('click', async () => {
      localStorage.removeItem('jwtToken');
      authSection.style.display = 'block';
      fileSection.style.display = 'none';
      userInfo.style.display = 'none';
    });
  
    async function loadFiles() {
        const query = `
          query {
            files
          }
        `;
        
        try {
          const response = await makeGraphQLRequest(query);
          if (response.errors) {
            console.error('GraphQL Errors:', response.errors);
            alert('Error loading files: ' + response.errors.map(err => err.message).join(', '));
            return;
          }
          const files = response.data.files;
      
          fileList.innerHTML = '';
          files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
              ${file}
              <div>
                <a href="/api/files/download/${file}" class="btn btn-primary btn-sm mr-2">Download</a>
                <button class="btn btn-danger btn-sm" onclick="deleteFile('${file}')">Delete</button>
              </div>
            `;
            fileList.appendChild(listItem);
          });
        } catch (error) {
          console.error('Error loading files:', error);
          alert('Error loading files. Please try again.');
        }
      }
  
    window.deleteFile = async function (filename) {
      const mutation = `
        mutation {
          deleteFile(filename: "${filename}") {
            success
          }
        }
      `;
  
      try {
        const response = await makeGraphQLRequest(mutation);
  
        if (response.data.deleteFile.success) {
          alert('File deleted successfully');
          loadFiles();
        } else {
          alert('File deletion failed');
        }
      } catch (error) {
        console.error('Error during file deletion:', error);
      }
    };
  
    async function makeGraphQLRequest(query) {
      const token = localStorage.getItem('jwtToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
  
      const response = await fetch('/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query })
      });
  
      return response.json();
    }
  });
  