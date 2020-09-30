import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

// Modal - Material UI
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState([
        // {
        //     userName: 'oksanabibik',
        //     caption: 'WOW It works!',
        //     imageUrl:
        //         'https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png',
        // },
        // {
        //     userName: 'stefanitol',
        //     caption: 'Cool!',
        //     imageUrl:
        //         'https://irvinecompany-h.assetsadobe.com/is/image/content/dam/apartments/3-readytopublish/communities/northerncalifornia/crescentvillage/photography/Irvine_Co_Apts_Crescent_Vill_Mirada_Unit_1339-01.tif?&wid=1920&crop=0,0,6004,3752&fit=stretch&iccEmbed=1&icc=AdobeRGB&resMode=sharp2&fmt=pjpeg&pscan=auto',
        // },
        // {
        //     userName: 'antonigates',
        //     caption: 'Fun project!',
        //     imageUrl:
        //         'https://www.nps.gov/common/uploads/banner_image/pwr/homepage/36C683FE-1DD8-B71B-0B6B4AE9C34946B8.jpg?width=2400&height=700&mode=crop&quality=90',
        // },
    ]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // this actually keeps you logged in
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // user has logged in...
                console.log(authUser);
                setUser(authUser);

                // commented code -> SEE LOGIC in promise in signUp method below
                // if (authUser.displayName) {
                //     // don't update username
                // } else {
                //     // if we just created someone
                //     return authUser.updateProfile({
                //         displayName: username,
                //     });
                // }
            } else {
                // user has logged out...
                setUser(null);
            }
        });
        return () => {
            // perform some cleanup actions
            unsubscribe();
        };
    }, [user, username]);

    // useEffect hook - Runs a piece of code based on a specific condition.
    // Condition go into here [] - if we leave it blank, this is gonna mean, it's gonna run once when the page loads, but then it's not gonna run again.
    // If we put [posts] - it would run once when the app component loads, but also every single time posts change

    // onSnapshot - powerful listener, what its gonna do, it's basically every single time the database changes in that collection, so every single time a document gets added / changed / modified inside the posts, imagine a camera right, it's just gonna take a snapshot of exactly what that collection looks like, so you're gonna get an update of all the documents if somebody adds a document or adds a post it's gonna update it
    useEffect(() => {
        db.collection('posts')
            // your last post is going to be the most recent
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                // setPosts(snapshot.docs.map((doc) => doc.data()));
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                    }))
                );
            });
    }, []);

    // const handleClose = ()=>{
    //   setOpen(false);
    // }

    // const signUp = (event) =>{
    //   setOpen(true);
    // }

    const signUp = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((error) => alert(error.message));
        setOpen(false);
    };

    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
        setOpenSignIn(false);
    };

    return (
        <div className="app">
            {/* Modal - Material UI */}
            <Modal
                open={open}
                // onClose={handleClose}
                onClose={() => setOpen(false)}
                // aria-labelledby="simple-modal-title"
                // aria-describedby="simple-modal-description"
            >
                {/* {body} */}
                <div style={modalStyle} className={classes.paper}>
                    {/* <h2 id="simple-modal-title">Text in a modal</h2>
                  <p id="simple-modal-description">
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </p>
                  <SimpleModal /> */}
                    {/* <h2>I am a modal</h2> */}
                    <form className="app__signup">
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt=""
                            />
                        </center>
                        <Input
                            placeholder="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signUp}>
                            Sign Up
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                // onClose={handleClose}
                onClose={() => setOpenSignIn(false)}
                // aria-labelledby="simple-modal-title"
                // aria-describedby="simple-modal-description"
            >
                {/* {body} */}
                <div style={modalStyle} className={classes.paper}>
                    {/* <h2 id="simple-modal-title">Text in a modal</h2>
                  <p id="simple-modal-description">
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </p>
                  <SimpleModal /> */}
                    {/* <h2>I am a modal</h2> */}
                    <form className="app__signup">
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt=""
                            />
                        </center>

                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signIn}>
                            Sign In
                        </Button>
                    </form>
                </div>
            </Modal>

            {/* Header */}
            <div className="app__header">
                <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                />

                {user ? (
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                ) : (
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
            </div>

            {/* <h1>HELLO Oksana Let's build an Instagram Clone</h1> */}

            {/* Post */}

            {/* 1. Using props */}
            {/* <Post
                userName="oksanabibik"
                caption="WOW It works!"
                imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png"
            /> */}

            {/* 2. Using state */}
            {/* {posts.map((post) => (    -> destructure */}
            <div className="app__posts">
                <div className="app__postsLeft">
                    {posts.map(({ id, post }) => (
                        <Post
                            key={id}
                            userName={post.userName}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                            postId={id}
                            user={user}
                        />
                    ))}
                </div>

                <div className="app__postsRight">
                    <InstagramEmbed
                        url="https://instagr.am/p/Zw9o4/"
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName="div"
                        protocol=""
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>
            </div>

            {user?.displayName ? (
                <ImageUpload username={user.displayName} />
            ) : (
                <h3>Sorry you need to login to upload</h3>
            )}
        </div>
    );
}

export default App;
