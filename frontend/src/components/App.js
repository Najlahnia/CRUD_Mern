import { useState, useEffect } from "react";

function App() {
  // State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Use effect
  useEffect(() => {
    fetchNotes();
    
    // Add Bootstrap CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    document.head.appendChild(link);
    
    // Add Bootstrap Icons
    const iconsLink = document.createElement('link');
    iconsLink.rel = 'stylesheet';
    iconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
    document.head.appendChild(iconsLink);
    
    // Add Bootstrap JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(iconsLink);
      document.body.removeChild(script);
    };
  }, []);

  // Initialize dark mode based on user preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.setAttribute('data-bs-theme', 'light');
    }
  }, [darkMode]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      // In a real app, use proper error handling
      const res = await fetch("http://localhost:3001/notes");
      const data = await res.json();
      setNotes(data.notes || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notes. Please try again later.");
      // Use mock data for demo purposes
      setNotes([
        { _id: "1", title: "Welcome", body: "Welcome to your notes app!", createdAt: new Date().toISOString() },
        { _id: "2", title: "Getting Started", body: "Create your first note by filling out the form below.", createdAt: new Date(Date.now() - 86400000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;
    setCreateForm({
      ...createForm,
      [name]: value,
    });
  };

  const createNote = async (e) => {
    e.preventDefault();
    
    if (!createForm.title.trim() || !createForm.body.trim()) {
      return;
    }

    try {
      // In a real app, use proper API calls
      const newNote = {
        _id: Date.now().toString(),
        title: createForm.title,
        body: createForm.body,
        createdAt: new Date().toISOString()
      };
      
      setNotes([newNote, ...notes]);
      
      setCreateForm({
        title: "",
        body: "",
      });
    } catch (err) {
      setError("Failed to create note. Please try again.");
    }
  };

  const deleteNote = async (_id) => {
    if (confirmDelete !== _id) {
      setConfirmDelete(_id);
      return;
    }
    
    try {
      // In a real app, use proper API calls
      const newNotes = notes.filter((note) => note._id !== _id);
      setNotes(newNotes);
      setConfirmDelete(null);
    } catch (err) {
      setError("Failed to delete note. Please try again.");
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  const toggleUpdate = (note) => {
    setUpdateForm({ title: note.title, body: note.body, _id: note._id });
  };

  const cancelUpdate = () => {
    setUpdateForm({ _id: null, title: "", body: "" });
  };

  const updateNote = async (e) => {
    e.preventDefault();

    if (!updateForm.title.trim() || !updateForm.body.trim()) {
      return;
    }

    try {
      // In a real app, use proper API calls
      const updatedNote = {
        _id: updateForm._id,
        title: updateForm.title,
        body: updateForm.body,
        createdAt: notes.find(note => note._id === updateForm._id).createdAt,
        updatedAt: new Date().toISOString()
      };
      
      const noteIndex = notes.findIndex((note) => note._id === updateForm._id);
      const newNotes = [...notes];
      newNotes[noteIndex] = updatedNote;
      
      setNotes(newNotes);
      setUpdateForm({ _id: null, title: "", body: "" });
    } catch (err) {
      setError("Failed to update note. Please try again.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeSortOrder = (order) => {
    setSortOrder(order);
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.body.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4">Notes App</span>
          <div className="d-flex align-items-center">
            <button 
              onClick={toggleDarkMode} 
              className="btn btn-outline-secondary"
            >
              {darkMode ? (
                <><i className="bi bi-sun"></i> Light Mode</>
              ) : (
                <><i className="bi bi-moon"></i> Dark Mode</>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mb-5">
        {/* Error message */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Search and sort controls */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">Sort by</span>
                  <select
                    className="form-select"
                    value={sortOrder}
                    onChange={(e) => changeSortOrder(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="alphabetical">A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="row g-4">
          {/* Notes form section */}
          <div className="col-lg-4">
            <div className="card sticky-top" style={{ top: "1rem" }}>
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  {updateForm._id ? (
                    <><i className="bi bi-pencil-square me-2"></i>Update Note</>
                  ) : (
                    <><i className="bi bi-plus-circle me-2"></i>Create Note</>
                  )}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={updateForm._id ? updateNote : createNote}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={updateForm._id ? updateForm.title : createForm.title}
                      onChange={updateForm._id ? handleUpdateFieldChange : updateCreateFormField}
                      placeholder="Note title"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="body" className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      id="body"
                      name="body"
                      rows="5"
                      value={updateForm._id ? updateForm.body : createForm.body}
                      onChange={updateForm._id ? handleUpdateFieldChange : updateCreateFormField}
                      placeholder="Note content"
                      required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    {updateForm._id ? (
                      <>
                        <button type="submit" className="btn btn-success">
                          <i className="bi bi-check-circle me-1"></i> Update
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={cancelUpdate}
                        >
                          <i className="bi bi-x-circle me-1"></i> Cancel
                        </button>
                      </>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-1"></i> Create
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Notes list section */}
          <div className="col-lg-8">
            <h4 className="mb-3 d-flex align-items-center">
              <i className="bi bi-journal-text me-2"></i>
              Your Notes 
              <span className="badge bg-secondary ms-2">{filteredNotes.length}</span>
            </h4>
            
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-journal-x display-1 text-muted"></i>
                  <p className="mt-3 text-muted">
                    {searchTerm ? "No notes match your search." : "No notes yet. Create your first note!"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {filteredNotes.map((note) => (
                  <div key={note._id} className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 note-card">
                      <div className="card-header d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-0 me-2">{note.title}</h5>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleUpdate(note)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className={`btn btn-sm ${confirmDelete === note._id ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => deleteNote(note._id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text text-truncate-3">
                          {note.body}
                        </p>
                      </div>
                      <div className="card-footer bg-transparent d-flex justify-content-between text-muted small">
                        <span><i className="bi bi-calendar-date me-1"></i>{formatDate(note.createdAt)}</span>
                        {note.updatedAt && <span><i className="bi bi-pencil-square me-1"></i>Updated</span>}
                      </div>
                      
                      {/* Delete confirmation */}
                      {confirmDelete === note._id && (
                        <div className="delete-confirm position-absolute bottom-0 start-0 end-0 p-3 bg-danger bg-opacity-10">
                          <p className="text-danger mb-2 small">Êtes-vous sûr de vouloir supprimer cette note?</p>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => deleteNote(note._id)}
                              className="btn btn-sm btn-danger"
                            >
                              Supprimer
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="btn btn-sm btn-secondary"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .text-truncate-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 4.5rem;
          }
          
          .note-card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .note-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          }
          
          .delete-confirm {
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;
          }
        `}
      </style>
    </div>
  );
}

export default App;