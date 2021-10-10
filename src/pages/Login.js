import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import {
  Box, Container, Typography, TextField, Button, Link
} from '@material-ui/core';
import { Formik } from 'formik';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, query, where
} from 'firebase/firestore';

const Login = () => {
  let failedLogin = false;
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>UNO COVID Resources Collection</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{ email: 'email', password: 'password' }}
            validationSchema={Yup.object().shape({ email: Yup.string().email('Must be a valid email').max(255).required('Email is required'), password: Yup.string().max(255).required('Password is required') })}
            onSubmit={async (values) => {
              initializeApp({
                apiKey: 'AIzaSyC64KY9UehoX2fk7Ugw2XNPvG4zZ7sSdsQ',
                authDomain: 'uno-genomics.firebaseapp.com',
                databaseURL: 'https://uno-genomics-default-rtdb.firebaseio.com',
                projectId: 'uno-genomics',
                storageBucket: 'uno-genomics.appspot.com',
                messagingSenderId: '351603848354',
                appId: '1:351603848354:web:e974a024da6b7e7472d3fb'
              });
              const db = getFirestore();
              const docsRef = collection(db, 'accounts');
              const q1 = query(docsRef, where('email', '==', values.email));
              const q2 = query(docsRef, where('password', '==', values.password));
              const querySnapshot1 = await getDocs(q1);
              const querySnapshot2 = await getDocs(q2);
              let isUser = false;
              if (querySnapshot1.docs.length === 1 && querySnapshot2.docs.length > 0) {
                for (let i = 0; i < querySnapshot2.docs.length; i++) {
                  if (values.email === querySnapshot2.docs[i].get('email')) isUser = true;
                }
              }
              if (isUser) {
                localStorage.setItem('userID', querySnapshot1.docs[0].get('userID'));
                if (querySnapshot1.docs[0].get('isAdmin') === true) {
                  localStorage.setItem('isAdmin', 'true');
                }
                navigate('/dashboard');
              } else {
                failedLogin = true;
              }
            }}
          >
            {({
              errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2"> Sign in </Typography>
                </Box>
                <TextField error={Boolean(touched.email && errors.email)} fullWidth helperText={touched.email && errors.email} label="email" margin="normal" name="email" onBlur={handleBlur} onChange={handleChange} type="email" value={values.email} variant="outlined" />
                <TextField error={Boolean(touched.password && errors.password)} fullWidth helperText={touched.password && errors.password} label="Password" margin="normal" name="password" onBlur={handleBlur} onChange={handleChange} type="password" value={values.password} variant="outlined" />
                <Box sx={{ py: 2 }}>
                  <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained"> Sign in now </Button>
                </Box>
                {failedLogin && <Typography color="textPrimary" variant="body1"> Username and Password combination unknown. Try again. </Typography>}
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?
                  {' '}
                  <Link component={RouterLink} to="/register" variant="h6" underline="hover">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
