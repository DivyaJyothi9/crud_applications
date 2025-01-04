import React, { useEffect, useState } from "react";
import {
  Navbar,
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers, addUser,deleteUser,loadSingleUser,updateUser } from "./redux/actions";
import { toast } from "react-toastify"; // Importing toast for notifications

const initialState = {
  name: "",
  email: "",
  contact: "",
  address: "",
};

const Home = () => {
  const [state, setState] = useState(initialState);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const { users, msg ,user} = useSelector((state) => state.data);

  const { name, email, contact, address } = state;

  // Fetch users when component is mounted
  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  // Display success message when msg changes
  useEffect(() => {
    if (msg) {
      toast.success(msg); // Show success toast notification
    }
  }, [msg]); // Added msg to the dependency array to avoid infinite loop

  useEffect(() => {
    if (user) {
      setState({ ...user});
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value }); // Update state based on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !address) {
      toast.error("Please fill all input fields");
    } else {
      if(!editMode) {
        console.log(state); // Log the state to inspect the form data
        dispatch(addUser(state)); // Dispatch addUser with form data
      
        // Reset the form fields after submission
        setState({ name: "", email: "", contact: "", address: "" });
      } else {
        dispatch(updateUser(state,userId));
        setState({ name: "", email: "", contact: "", address: "" });
        setEditMode(false);
        setUserId(null);
      }
    }
    
    
    // Reload users after adding a new user
     // Ensure the table updates
  };
  

  const handleDelete=(id) =>{
    if(window.confirm("Are you sure that you wanted to delete that user?")){
      dispatch(deleteUser(id));
    }
  }
  const handleUpdate=(id) => {
    dispatch(loadSingleUser(id));
    setUserId(id);
    setEditMode(true);
    }
  return (
    <>
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand>Python Flask MongoDB Redux CRUD Application</Navbar.Brand>
      </Navbar>
      <Container style={{ marginTop: "70px" }}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Contact"
                  name="contact"
                  value={contact || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={address || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-grid gap-2 mt-2">
                <Button type="submit" variant="primary" size="lg">
                  {editMode ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>

          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.contact}</td>
                      <td>{item.address}</td>
                      <td>
                        <ButtonGroup>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="danger"
                            onClick={()=> handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                          <Button variant="secondary"onClick={() => handleUpdate(item._id)}>Update</Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;