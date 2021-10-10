import { Helmet } from 'react-helmet';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, query, where
} from 'firebase/firestore';
import { MaterialTable } from 'material-table';

const getSamples = async () => {
  initializeApp({
    apiKey: 'AIzaSyC64KY9UehoX2fk7Ugw2XNPvG4zZ7sSdsQ',
    authDomain: 'uno-genomics.firebaseapp.com',
    databaseURL: 'https://uno-genomics-default-rtdb.firebaseio.com',
    projectId: 'uno-genomics',
    storageBucket: 'uno-genomics.appspot.com',
    messagingSenderId: '351603848354',
    appId: '1:351603848354:web:e974a024da6b7e7472d3fb'
  });

  const samplesCollection = collection(getFirestore(), 'samples');
  const samples = [];
  let id = 0;
  if (localStorage.getItem('isAdmin') === 'true') {
    const querySnapshot = await getDocs(samplesCollection);
    querySnapshot.forEach((doc) => {
      id++;
      const sample = {
        id, name: doc.get('name'), stage: doc.get('stage'), submissionDate: doc.get('submissionDate'), completionDateEstimate: doc.get('completionDateEstimate')
      };
      samples.push(sample);
    });
  } else {
    const querySnapshot = await getDocs(query(samplesCollection, where('userID', '==', localStorage.getItem('userID'))));
    querySnapshot.forEach((doc) => {
      const sample = {
        id, name: doc.get('name'), stage: doc.get('stage'), submissionDate: doc.get('submissionDate'), completionDateEstimate: doc.get('completionDateEstimate')
      };
      samples.push(sample);
    });
  }

  return samples;
};

const Dashboard = () => {
  const samples = getSamples();
  const columns = [
    { title: 'name', field: 'Name' },
    { title: 'stage', field: 'Stage' },
    { title: 'submissionDate', field: 'Date of Submission' },
    { title: 'completionDateEstimate', field: 'Estimated Completion Date' },
  ];

  return (
    <>
      <Helmet>
        <title> UNO COVID Resources Collection </title>
      </Helmet>
      <MaterialTable columns={columns} data={samples} title="Samples" />
    </>
  );
};

export default Dashboard;
