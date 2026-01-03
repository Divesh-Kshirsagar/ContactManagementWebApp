import { ContactForm, ContactList } from './features/contacts/components';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Contacts</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your contacts efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Add Contact
              </h2>
              <ContactForm />
            </div>
          </div>
          
          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Contact List
              </h2>
              <ContactList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;