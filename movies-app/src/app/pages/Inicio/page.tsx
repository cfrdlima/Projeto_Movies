"use client";

import React, { useState } from "react";
import "./page.scss";
import Image from "next/image";
import Navbar from "@/components/navbar/page";
import { BiSearchAlt2 } from "react-icons/bi";
import movieBackground from "../../assets/movie_background.jpg";
import { IoIosArrowForward } from "react-icons/io";
import ReactLoading from "react-loading";
import { useMovies } from "@/hooks/useMovies";
import { useRouter } from "next/navigation";
import AuxiliarScrollMovie from "@/components/auxiliar/auxiliarScrollMovie";

export default function HomePage() {
  const [category, setCategory] = useState<string>("Inicio");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) {
      return;
    } else {
      router.push(`/Pages/Search?q=${search}`);
      setSearch("");
    }
  };

  const { movies: movies2024, isLoading: isLoading2024 } = useMovies({
    primary_release_year: "2024",
    without_genres: "16",
  });

  const { movies: horrorMovies, isLoading: isLoadingHorror } = useMovies({
    primary_release_year: "2024",
    with_genres: "27",
    sort_by: "popularity.desc",
    include_adult: "true",
  });

  const { movies: actionMovies, isLoading: isLoadingAction } = useMovies({
    primary_release_year: "2024",
    with_genres: "28",
    sort_by: "popularity.desc",
    include_adult: "true",
    without_genres: "16",
  });

  if (isLoading2024) {
    return (
      <div className="loading-container">
        <ReactLoading type="spin" color="#6046ff" height={"5%"} width={"5%"} />
      </div>
    );
  }

  return (
    <>
      <Navbar currentCategory={category} setCategory={setCategory} />
      <section className="homePage-search">
        <Image
          className="homePage-background"
          src={movieBackground}
          alt="background"
          quality={100}
        />
        <div className="homePage-title">Bem vindo ao Já vi esse filme?</div>
        <div className="homePage-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Busque um filme"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <button type="submit">
              <BiSearchAlt2 className="homePage-icon" />
            </button>
          </form>
        </div>
      </section>
      <section className="homePage-movieList">
        <div className="homePage-title-container">
          <div className="homePage-movieList-title">
            <h1>Últimos Lançamentos</h1>
            <IoIosArrowForward className="homePage-iconArrow" />
          </div>
        </div>
        <div className="homePage-movieList-card">
          <AuxiliarScrollMovie movies={movies2024} />
        </div>
      </section>
      <section className="homePage-movieList">
        <div className="homePage-title-container">
          <div className="homePage-movieList-title">
            <h1>Últimos lançamentos terror</h1>
            <IoIosArrowForward className="homePage-iconArrow" />
          </div>
        </div>
        <div className="homePage-movieList-card">
          <AuxiliarScrollMovie movies={horrorMovies} />
        </div>
      </section>
      <section className="homePage-movieList">
        <div className="homePage-title-container">
          <div className="homePage-movieList-title">
            <h1>Últimos lançamentos Ação</h1>
            <IoIosArrowForward className="homePage-iconArrow" />
          </div>
        </div>
        <div className="homePage-movieList-card">
          <AuxiliarScrollMovie movies={actionMovies} />
        </div>
      </section>
    </>
  );
}