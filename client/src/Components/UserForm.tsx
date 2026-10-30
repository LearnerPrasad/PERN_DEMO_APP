import React, { useState, type ChangeEvent } from 'react';

type formValues = {
  name: string;
  email: string;
  city: string;
};

type CreatedUser = formValues & { id: number };

type UserFormProps = {
  onUserCreated: (user: CreatedUser) => void;
  onUserUpdated: (user: CreatedUser) => void;
  editUser: CreatedUser | null;
  onError: (message: string) => void;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
};

export default function UserForm({
  onUserCreated,
  editUser,
  onUserUpdated,
  onError,
  isLoading,
}: UserFormProps) {
  const [formValues, setFormValues] = useState<formValues>({
    name: editUser?.name ?? '',
    email: editUser?.email ?? '',
    city: editUser?.city ?? '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const hasEmptyFields = Object.values(formValues).some(
    (value) => !value.trim()
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onError('');

    const url = editUser
      ? 'http://localhost:3000/prasad/putUserData'
      : 'http://localhost:3000/prasad/postUserData';

    const method = editUser ? 'PUT' : 'POST';

    const dataToSend = editUser
      ? { ...formValues, id: editUser.id }
      : formValues;
    const token = localStorage.getItem('athzToken');
    fetch(url, {
      method,
      headers: { 
        'content-type': 'application/json',
        authorization : `Bearer ${token}`
       },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((body) => {
            throw new Error(
              body.error || `Request failed: ${response.status}`
            );
          });
        }

        return response.json();
      })
      .then((savedUser: CreatedUser) => {
        if (editUser) {
          onUserUpdated(savedUser);
        } else {
          onUserCreated(savedUser);
        }

        setFormValues({ name: '', email: '', city: '' });
      })
      .catch((error) =>
        onError(
          error instanceof Error ? error.message : 'Request failed'
        )
      );
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter full name"
          required
          value={formValues.name}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          required
          value={formValues.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          placeholder="Enter city"
          required
          value={formValues.city}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={hasEmptyFields || isLoading}
        >
          {isLoading
            ? 'Saving...'
            : editUser
              ? 'Update Contact'
              : 'Add Contact'}
        </button>

        {editUser && (
          <button
            type="button"
            className="secondary-button"
            disabled={isLoading}
            onClick={() => {
              setFormValues({ name: '', email: '', city: '' });
              onError('');
              onUserUpdated(editUser);
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}