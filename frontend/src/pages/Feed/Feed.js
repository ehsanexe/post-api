import React, { Component, Fragment } from "react";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";
import openSocket from "socket.io-client";
import { isGraphQL } from "../../flags";
class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    // fetch('http://localhost:8080/auth/status', {
    //   headers: {
    //     Authorization: 'Bearer ' + this.props.token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200) {
    //       throw new Error('Failed to fetch user status.');
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     this.setState({ status: resData.status });
    //   })
    //   .catch(this.catchError);

    this.loadPosts();
    const socket = openSocket("http://localhost:8080");
    socket.on("posts", (data) => {
      if (data.action === "create") {
        this.addPost(data.post);
      } else if (data.action === "update") {
        this.updatePost(data.post);
      } else if (data.action === "delete") {
        this.loadPosts();
      }
    });
  }

  addPost = (post) => {
    this.setState((prevState) => {
      const updatedPosts = [...prevState.posts];
      if (prevState.postPage === 1) {
        if (prevState.posts.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      return {
        posts: updatedPosts,
        totalPosts: prevState.totalPosts + 1,
      };
    });
  };

  updatePost = (post) => {
    this.setState((prevState) => {
      const updatedPosts = [...prevState.posts];
      const updatedPostIndex = updatedPosts.findIndex(
        (p) => p._id === post._id
      );
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      return {
        posts: updatedPosts,
      };
    });
  };

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }

    const url = isGraphQL
      ? "http://localhost:8081/graphql"
      : "http://localhost:8080/feed/posts?page=" + page;

    fetch(url, {
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": isGraphQL
          ? "application/json"
          : "text/plain;charset=UTF-8",
      },
      method: isGraphQL ? "POST" : "GET",
      body: isGraphQL
        ? JSON.stringify({
            query: `query loadPosts($page: Int!){
              posts(page: $page, pageSize: 5) {
                posts {
                  id
                  title
                  imageUrl
                  content
                  creator {
                    name
                    email

                  }
                  createdAt
                }
                totalItems
              }
            }
            `,
            variables: {
              page: page,
            },
          })
        : undefined,
    })
      .then((res) => {
        if (!isGraphQL && res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((resData) => {
        if (isGraphQL && resData.errors?.length) {
          throw new Error("Failed to fetch posts.");
        }

        if (isGraphQL) {
          resData = resData.data.posts;
        }
        this.setState({
          posts: resData.posts.map((post) => {
            return {
              ...post,
              imagePath: post.imageUrl,
            };
          }),
          totalPosts: resData.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  // statusUpdateHandler = event => {
  //   event.preventDefault();
  //   fetch('http://localhost:8080/auth/status', {
  //     method: 'PATCH',
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.token,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       status: this.state.status
  //     })
  //   })
  //     .then(res => {
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error("Can't update status!");
  //       }
  //       return res.json();
  //     })
  //     .then(resData => {
  //       console.log(resData);
  //     })
  //     .catch(this.catchError);
  // };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = {
        ...prevState.posts.find((p) => p._id === postId || p.id === postId),
      };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = async (postData) => {
    this.setState({
      editLoading: true,
    });
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("image", postData.image);
    let url = isGraphQL
      ? "http://localhost:8081/graphql"
      : "http://localhost:8080/feed/post";
    let method = "POST";
    if (this.state.editPost && !isGraphQL) {
      url = "http://localhost:8080/feed/post/" + this.state.editPost._id;
      method = "PUT";
    }

    let imageUrl = "";

    if (isGraphQL) {
      const response = await fetch("http://localhost:8081/saveimage", {
        method: "PUT",
        body: formData,
        headers: { Authorization: "Bearer " + this.props.token },
      });
      const data = await response.json();
      imageUrl = data.imageUrl;
    }

    const body = this.state.editPost
      ? {
          query: `mutation editPost($title: String!, $content: String!, $imageUrl: String!, $postId: String!){
        updatePost(title: $title, content: $content, imageUrl: $imageUrl, postId: $postId) { id }
      }`,
          variables: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl,
            postId: this.state.editPost?.id ?? this.state.editPost?._id,
          },
        }
      : {
          query: `mutation createPost($title: String!, $content: String!, $imageUrl: String!){
      createPost(title: $title, content: $content, imageUrl: $imageUrl) { id }
    }`,
          variables: {
            title: postData.title,
            content: postData.content,
            imageUrl: imageUrl,
          },
        };

    fetch(url, {
      method: method,
      body: isGraphQL ? JSON.stringify(body) : formData,
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": isGraphQL
          ? "application/json"
          : "text/plain;charset=UTF-8",
      },
    })
      .then((res) => {
        if (!isGraphQL && res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (isGraphQL && resData.errors && resData.errors.length) {
          throw new Error("Creating or editing a post failed!");
        }
        this.setState((prevState) => {
          return {
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });

    const url = isGraphQL
      ? "http://localhost:8081/graphql"
      : "http://localhost:8080/feed/post/" + postId;

    const body = {
      query: `mutation deletePost($postId: String!){ deletePost(postId: $postId) }`,
      variables: { postId },
    };

    fetch(url, {
      method: isGraphQL ? "POST" : "DELETE",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": isGraphQL
          ? "application/json"
          : "text/plain;charset=UTF-8",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!isGraphQL && res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a post failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (isGraphQL && resData.errors && resData.errors.length) {
          throw new Error("Deleting a post failed!");
        }
        console.log(resData);
        this.loadPosts();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        {/* <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section> */}
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: "center" }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, "previous")}
              onNext={this.loadPosts.bind(this, "next")}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post?._id ?? post?.id}
                  id={post?._id ?? post?.id}
                  author={post.creator.name}
                  date={new Date(parseInt(post.createdAt)).toLocaleDateString(
                    "en-US"
                  )}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(
                    this,
                    post?._id ?? post?.id
                  )}
                  onDelete={this.deletePostHandler.bind(
                    this,
                    post?._id ?? post?.id
                  )}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
