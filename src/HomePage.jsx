import React, { useState, useEffect } from "react";
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
      game3: "井字棋（Tic Tac Toe）",
      pin: "置顶",
    },
    en: {
      title: "🎮 Welcome to Foo's Mini Game",
      subtitle: "Choose a game to start playing!",
      toGame: "Play Game",
      game1: "Rock Paper Scissors",
      game2: "More mini games coming soon...",
      game3: "Tic Tac Toe",
      pin: "Pin to Top",
    },
  };

  const t = text[language];

  const [games, setGames] = useState([
    {
      id: 1,
      titleKey: "game1",
      image: "/gallery/rps.jpg",
      route: "/rps",
      disabled: false,
    },
    {
      id: 2,
      titleKey: "game3",
      image: "/gallery/tictactoe.jpg", // 请确保这个图片存在
      route: "/tictactoe",
      disabled: false,
    },
    {
      id: 3,
      titleKey: "game2",
      image: "/gallery/comingsoon.jpg",
      route: "#",
      disabled: true,
    },
  ]);

  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const handlePinToTop = (index) => {
    const newGames = [...games];
    const [selected] = newGames.splice(index, 1);
    newGames.unshift(selected);
    setGames(newGames);
    setOpenMenuIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".card-menu")) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="container-fluid py-5"
      style={{
        paddingTop: "80px",
        backgroundImage: "url('/Screenshot (254).png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
        backgroundColor:"transparent",
      }}
    >
      <div className="container">
        {/* 切换语言按钮 */}
        {/* 这个是本来语言切换按键button的位置
        <div className="d-flex justify-content-end mb-4">
          <LanguageSwitcher
            language={language}
            toggleLanguage={toggleLanguage}
          />
        </div>
        */}

        <div className="text-center my-5">
          <h1 className="display-4 fw-bold text-light">{t.title}</h1>
          <p className="lead text-light">{t.subtitle}</p>
        </div>

        <div className="row justify-content-center">
          {games.map((game, index) => (
            <div className="col-md-4 mb-4" key={game.id}>
              <Card className="shadow position-relative" style={{ height: "100%" }}>
                {/* 三点按钮 */}
                <div
                  role="button"
                  tabIndex={0}
                  className="card-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                  }}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: "5px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    zIndex: 10,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#6dc7ed")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ color: "black", fontWeight: "bold" }}>⋮</span>
                </div>

                {/* 自定义下拉菜单 */}
                {openMenuIndex === index && (
                  <div
                    className="position-absolute bg-white shadow-sm rounded card-menu"
                    style={{
                      top: 40,
                      right: 10,
                      zIndex: 20,
                      minWidth: "120px",
                      padding: "5px 0",
                    }}
                  >
                    <div
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePinToTop(index)}
                    >
                      {t.pin}
                    </div>
                  </div>
                )}

                <Card.Img
                  variant="top"
                  src={game.image}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <Card.Title className="mb-2 fw-bold">
                    {t[game.titleKey]}
                  </Card.Title>
                  <Card.Text className="mb-3 text-muted">
                    {game.titleKey === "game1"
                      ? language === "zh"
                        ? "和朋友对战，选择剪刀、石头或布，看看谁能赢！"
                        : "Play with a friend! Choose rock, paper, or scissors and see who wins!"
                      : game.titleKey === "game3"
                      ? language === "zh"
                        ? "挑战井字棋策略游戏，率先连成三格即可获胜！"
                        : "Challenge your logic! First to align 3 marks wins the game!"
                      : t.game2}
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
