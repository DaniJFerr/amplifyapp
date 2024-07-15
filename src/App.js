// import logo from './logo.svg';
import './App.css';
import "@aws-amplify/ui-react/styles.css"
import { generateClient  } from 'aws-amplify/api';
import {
  withAuthenticator,
  Flex,
  Text,
  TextField,
  Button,
  Heading,
  // Image,
  View,
  // Card
} from "@aws-amplify/ui-react";
// import { signOut } from 'aws-amplify/auth';
import { listNotes } from './graphql/queries';
import {  
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation
} from './graphql/mutations';
// import { signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

const client = generateClient();

const App = ({signOut}) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

async function fetchNotes() {
  const apiData = await client.graphql({ query: listNotes });
  const notesFromAPI = apiData.data.listNotes.items;
  setNotes(notesFromAPI);
}

async function createNote(event) {
   event.preventDefault();
   const from = new FormData(event.target);
   const data = {
    name: from.get("name"),
    description: from.get("description"),
   };
   await client.graphql({
    query: createNoteMutation,
    variables: { input: data },
   });
   fetchNotes();
   event.target.reset();
}

async function deleteNote({ id }) {
  const newNotes = notes.filter((note) => note.id !== id );
  setNotes(newNotes);
  await client.graphql({
    query: deleteNoteMutation,
    variables: { input: { id } },
  });
}
  return (
   <View className='App'>
      {/* <Card>
        <Image src={logo} className='App-logo' alt='logo'/>
        <Heading level={1}>We now have Auth!</Heading>
      </Card> */}

     <Heading level={1}>My Notes App</Heading>
      <View as='form' margin='3rem 0' onSubmit={createNote}>
        <Flex direction='row' justifyContent="center">
          <TextField 
            name='name'
            placeholder='Note name'
            label='Note name'
            labelHidden
            variation='quiet'
            required
          />
          <TextField 
             name='description'
             placeholder='Note description'
             label='Note description'
             labelHidden
             variation='quiet'
             required
          />
           <Button type='submit' variation='primary'>create Note</Button>
        </Flex>
      </View>
    <Heading level={2}>Current Notes</Heading>
    <View margin='3rem 0'>
      {notes.map((note) => (
        <Flex 
          key={notes.id || notes.name}
          direction='row'
          justifyContent='center'
          alignItems='center' 
        >
        <Text as='strong' fontWeight={700}>
          {note.name}
        </Text>
        <Text as='span'>
        {note.description}
        </Text>
        <Button variation='link' onClick={() => deleteNote(note)}>
          Delete Note
        </Button>
        </Flex>
      ))}
     </View>
     <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
