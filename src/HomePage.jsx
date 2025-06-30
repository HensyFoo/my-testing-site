import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HomePage({ language, toggleLanguage }) {
  const navigate = useNavigate();

  const text = {
    zh: {
      title: "🎮 欢迎来到 Foo 的小游戏天地",
      subtitle: "选择一个游戏开始挑战吧！",
      toGame: "开始游戏",
      game1: "剪刀石头布",
      game2: "敬请期待更多小游戏...",
    },
    en: {
      title: "🎮 Welcome to Foo's Mini Game",
      subtitle: "Choose a game to start playing!",
      toGame: "Play Game",
      game1: "Rock Paper Scissors",
      game2: "More mini games coming soon...",
    },
  };

  const t = text[language];

  const games = [
    {
      title: t.game1,
      description: language === "zh"
        ? "和朋友对战，选择剪刀、石头或布，看看谁能赢！"
        : "Play with a friend! Choose rock, paper, or scissors and see who wins!",
      image: "/gallery/rps.jpg",
      route: "/rps",
      disabled: false,
    },
    {
      title: "Coming Soon",
      description: t.game2,
      image: "/gallery/comingsoon.jpg",
      route: "#",
      disabled: true,
    },
  ];

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundImage: "url('/Screenshot (254).png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <div className="container">
        {/* 语言切换按钮位置放这儿 */}
        <div className="d-flex justify-content-end mb-4">
          <LanguageSwitcher language={language} toggleLanguage={toggleLanguage} />
        </div>

        <div className="text-center my-5">
          <h1 className="display-4 fw-bold text-light">{t.title}</h1>
          <p className="lead text-light">{t.subtitle}</p>
        </div>

        <div className="row justify-content-center">
          {games.map((game, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <Card className="shadow" style={{ height: "100%" }}>
                <Card.Img
                  variant="top"
                  src={game.image}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <Card.Title className="mb-2 fw-bold">{game.title}</Card.Title>
                  <Card.Text className="mb-3 text-muted ">
                    {game.description}
                  </Card.Text>
                  <Button
                    variant="primary"
                    disabled={game.disabled}
                    onClick={() => {
                      if (!game.disabled) navigate(game.route);
                    }}
                  >
                    {t.toGame}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
