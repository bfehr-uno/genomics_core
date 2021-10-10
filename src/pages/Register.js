import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc, setDoc, query, getDocs, where
} from 'firebase/firestore';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import {
  Box, Button, Checkbox, Container, FormHelperText, Link, TextField, Typography
} from '@material-ui/core';
import { Navigate } from 'react-router';

const initializeDB = () => {
  initializeApp({
    apiKey: 'AIzaSyC64KY9UehoX2fk7Ugw2XNPvG4zZ7sSdsQ',
    authDomain: 'uno-genomics.firebaseapp.com',
    databaseURL: 'https://uno-genomics-default-rtdb.firebaseio.com',
    projectId: 'uno-genomics',
    storageBucket: 'uno-genomics.appspot.com',
    messagingSenderId: '351603848354',
    appId: '1:351603848354:web:e974a024da6b7e7472d3fb'
  });
  return getFirestore();
};

const accountExists = async (accountsRef, email, phoneNumber) => {
  const q1 = query(accountsRef, where('email', '==', email));
  const querySnapshot1 = await getDocs(q1);
  if (querySnapshot1.length === 1) {
    return true;
  }
  const q2 = query(accountsRef, where('phoneNumber', '==', phoneNumber));
  const querySnapshot2 = await getDocs(q2);
  if (querySnapshot2.length === 1) {
    return true;
  }
  return false;
};

const addClient = async (accountsRef, firstName, lastName, org, email, phoneNumber, password) => {
  await setDoc(doc(accountsRef, 'clients'), {
    firstName,
    lastName,
    org,
    email,
    phoneNumber,
    password
  }, { merge: true });
};

const Register = () => {
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 8) {
      errors.password = 'Must be at least 8 characters';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: 'email',
      password: 'password'
    },
    validate,
    onSubmit: (values) => {
      const db = initializeDB();
      const accountsRef = collection(db, 'clients');

      if (!accountExists(accountsRef, values.email, values.phoneNumber)) {
        addClient(accountsRef, values.firstName, values.lastName, values.org, values.email, values.phoneNumber, values.password);
        Navigate('/dashboard', { replace: true });
      }
    },
  });

  return (
    <>
      <Helmet>
        <title> UNO COVID Resources Collection </title>
      </Helmet>
      <Box sx={{
        backgroundColor: 'background.default', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center'
      }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography color="textSecondary" variant="h2"> Create new account </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2"> Use your email to create new account</Typography>
            </Box>
            <TextField inputProps={{ style: { color: 'black' } }} InputLabelProps={{ style: { color: 'black' } }} error={Boolean(formik.touched.firstName && formik.errors.firstName)} fullWidth helperText={formik.touched.firstName && formik.errors.firstName} label="First name" margin="normal" name="firstName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.firstName} variant="outlined" />
            <TextField inputProps={{ style: { color: 'black' } }} InputLabelProps={{ style: { color: 'black' } }} error={Boolean(formik.touched.lastName && formik.errors.lastName)} fullWidth helperText={formik.touched.lastName && formik.errors.lastName} label="Last name" margin="normal" name="lastName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.lastName} variant="outlined" />
            <TextField inputProps={{ style: { color: 'black' } }} InputLabelProps={{ style: { color: 'black' } }} error={Boolean(formik.touched.email && formik.errors.email)} fullWidth helperText={formik.touched.email && formik.errors.email} label="Email Address" margin="normal" name="email" onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" value={formik.values.email} variant="outlined" />
            <TextField inputProps={{ style: { color: 'black' } }} InputLabelProps={{ style: { color: 'black' } }} error={Boolean(formik.touched.password && formik.errors.password)} fullWidth helperText={formik.touched.password && formik.errors.password} label="Password" margin="normal" name="password" onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" value={formik.values.password} variant="outlined" />
            <Box sx={{ alignItems: 'center', display: 'flex', ml: -1 }}>
              <Checkbox checked={formik.values.policy} name="policy" onChange={formik.handleChange} />
              <Typography color="textSecondary" variant="body1">
                I have read the
                {' '}
                <Link color="primary" component={RouterLink} to="#" underline="always" variant="h6"> Terms and Conditions </Link>
              </Typography>
            </Box>
            {Boolean(formik.touched.policy && formik.errors.policy) && (
            <FormHelperText error>
              {formik.errors.policy}
            </FormHelperText>
            )}
            <Box sx={{ py: 2 }}>
              <Button color="primary" disabled={formik.isSubmitting} fullWidth size="large" type="submit" variant="contained"> Sign up now </Button>
            </Box>
            <Typography color="textSecondary" variant="body1">
              Have an account?
              {' '}
              <Link component={RouterLink} to="/login" variant="h6" underline="hover">
                Sign in
              </Link>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
