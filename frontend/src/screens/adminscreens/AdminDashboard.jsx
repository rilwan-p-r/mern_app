import { useEffect, useState } from 'react'
import HeaderAdmin from '../../components/adminComponents/HeaderAdmin'
import { useDeleteUserMutation, useGetUsersMutation } from '../../slices/adminSlice/adminApiSlice';
import AddUser from '../../components/adminComponents/AddUser';
import EditUser from '../../components/adminComponents/EditUser';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [existingUser, setExistingUser] = useState(users?.length || 0)
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);

    // finding user
    const [getUsers, { isLoading }] = useGetUsersMutation()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUsers()
                console.log("Response:", response.data);
                setUsers(response.data)
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users");
            }
        }
        fetchData()
    }, [isAddUserModalOpen, isEditUserModalOpen, existingUser])


    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    console.log('userrrrr',currentUsers,'lllllll',indexOfFirstUser,'bbbb',indexOfLastUser)
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // search
    useEffect(() => {
        const searchedUsers = filterUsers(search, users)
        setFilteredUsers(searchedUsers)
    }, [search, users])

    function filterUsers(text, userList) {
        if (text == '') {
            return userList
        } else {
            const filtered = userList.filter((user) => {
                return (
                    user.name.toLowerCase().includes(text.toLowerCase()) ||
                    user.email.toLowerCase().includes(text.toLowerCase())
                )
            })
            return filtered
        }
    }

    // adduser
    const openAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    // edit user
    const openEditUserModal = (user) => {
        setSelectedUser(user);
        setIsEditUserModalOpen(true);
    };

    const closeEditUserModal = () => {
        setSelectedUser(null);
        setIsEditUserModalOpen(false);
    };

    // deleteUser
    const [deleteUser, { removeLoading }] = useDeleteUserMutation()

    const handleDelete = async (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user!',
            icon: 'warning',
            iconColor: '#3F51B5',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3F51B5',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteUser({ userId: userId }).unwrap()
                    if (res) {
                        setExistingUser(prev => prev - 1)
                        toast.success('user deleted successfully')
                    }
                } catch (error) {
                    toast.error(error?.data?.message || error.message)
                }
            }
        })
    }

    return (
        <>
            <HeaderAdmin />
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col sm:py-12">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-gray-200 px-4 py-3">
                        <input
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Search users..."
                            className="w-full h-10 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-3 px-4 text-left">Profile Pic</th>
                                    <th className="py-3 px-4 text-left">Username</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="py-4 px-4">
                                            <img
                                                src={user.profileImage}
                                                alt={user.name}
                                                className="h-12 w-12 rounded-full"
                                            />
                                        </td>
                                        <td className="py-4 px-4">{user.name}</td>
                                        <td className="py-4 px-4">{user.email}</td>
                                        <td className="py-4 px-4">
                                            <button onClick={() => openEditUserModal(user)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                                                Edit
                                            </button>
                                            <span className="text-gray-300 mx-2">|</span>
                                            <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900 focus:outline-none">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!currentUsers.length && (
                                    <tr className="bg-gray-100">
                                        <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={openAddUserModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-52 mt-4 mb-4 rounded focus:outline-none focus:shadow-outline" >
                        Add User
                    </button>
                    <div className="bg-gray-200 px-4 py-3 flex justify-between items-center">
                        <div>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="mx-4 ml-32">
                                Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
                            </span>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-24 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {
                isEditUserModalOpen && (
                    <EditUser userData={selectedUser} isOpen={isEditUserModalOpen} onClose={closeEditUserModal} />
                )
            }
            {isAddUserModalOpen && (
                <AddUser isOpen={isAddUserModalOpen} onClose={closeAddUserModal} />
            )}

        </>
    );
};


export default AdminDashboard;