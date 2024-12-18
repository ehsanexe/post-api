import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";
import { isGraphQL } from "../../../flags";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const url = isGraphQL
      ? "http://localhost:8081/graphql"
      : "http://localhost:8080/feed/post/" + postId;

    const imageBaseUrl = isGraphQL
      ? "http://localhost:8081/"
      : "http://localhost:8080/";

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
            query: `{post(id: "${postId}") {title creator { name } imageUrl createdAt content}}`,
          })
        : undefined,
    })
      .then((res) => {
        if (!isGraphQL && res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        if (isGraphQL && resData.errors?.length) {
          throw new Error("Failed to fetch post.");
        }

        if (isGraphQL) {
          resData = resData.data;
        }

        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          image: imageBaseUrl + resData.post.imageUrl.replace("\\", "/"),
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          content: resData.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
