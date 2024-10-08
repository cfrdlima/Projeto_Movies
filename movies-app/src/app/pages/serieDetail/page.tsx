"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSeriesDetails } from "@/hooks/useSerieDetails";
import Navbar from "@/components/navbar/page";
import "./serieDetail.scss";
import StarRating from "@/components/StarRating/indext";
import ReactLoading from "react-loading";
import { IoIosArrowForward } from "react-icons/io";
import { useSeriesWatchProviders } from "@/hooks/userSeriesWatchProviders";
import AuxiliarScrollSerie from "@/components/auxiliar/auxiliarScrollSerie";
import { useSimilarSeries } from "@/hooks/useSimilarSeries";
import { useRecommendationsSeries } from "@/hooks/useRecommendationsSeries";

type Category = string;

function SerieDetailContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const serieId = query ? Number(query) : 0;

  const { serie: watchProviders, isLoading: watchProvidersLoading } =
    useSeriesWatchProviders(serieId);
  const { serie, isLoading } = useSeriesDetails(serieId);
  const [category, setCategory] = useState<Category>(
    `Série: Título não disponível`
  );
  const { series: similarSeries } = useSimilarSeries(serieId);
  const { series: recomendationSeries } = useRecommendationsSeries(serieId);

  useEffect(() => {
    if (serie) {
      setCategory(`Série: ${serie.original_name}`);
    }
  }, [serie]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", options).format(date);
  };

  const statusTranslations: Record<string, string> = {
    Released: "Lançado",
    "Post Production": "Pós-Produção",
    "Returning Series": "Em Produção",
    "In Production": "Em Produção",
    Canceled: "Cancelado",
    Ended: "Encerrada",
  };

  const getTranslatedStatus = (status: string) => {
    return statusTranslations[status] || status;
  };

  return (
    <>
      <Navbar currentCategory={category} setCategory={setCategory} />
      <ul className="movie-details">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading
              type="spin"
              color="#6046ff"
              height={"5%"}
              width={"5%"}
            />
          </div>
        ) : serie ? (
          <>
            <section className="movie-detail-container-section">
              <div className="movie-detail-poster-background">
                <img
                  src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`}
                  alt={serie.original_name}
                />
              </div>
              <div className="movie-detail-poster-container">
                <div className="movie-detail-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/original${serie.poster_path}`}
                    alt={serie.original_name}
                  />
                </div>
                <div className="movie-detail-providers">
                  {watchProvidersLoading ? (
                    <ReactLoading
                      type="spin"
                      color="#6046ff"
                      height={"5%"}
                      width={"5%"}
                    />
                  ) : watchProviders && watchProviders.length > 0 ? (
                    watchProviders
                      .flat()
                      .map((provider) =>
                        provider ? (
                          <img
                            key={provider.provider_id}
                            src={
                              provider.logo_path
                                ? `https://image.tmdb.org/t/p/original${provider.logo_path}`
                                : ""
                            }
                            alt={provider.provider_name || "Provider sem nome"}
                          />
                        ) : (
                          <p key={`provider-${Math.random()}`}>
                            Streamings não disponíveis no momento
                          </p>
                        )
                      )
                  ) : (
                    <p className="movie-detail-providers-null">
                      Streamings não disponíveis no momento
                    </p>
                  )}
                </div>
              </div>
              <div className="movie-detail-container">
                <div className="movie-detail-titulo-aux-1">
                  <p>{serie.original_name}</p>
                  <h2>{serie.genres.map((genre) => genre.name).join(", ")}</h2>
                </div>
                <div className="movie-detail-avaliacao-aux-2">
                  <div className="movie-detail-vote">
                    <p>Avaliação: </p>
                    <StarRating rating={serie.vote_average} />
                  </div>
                </div>
                <div className="movie-detail-data-aux-3">
                  <div className="movie-detail-data">
                    <p>Primeiro episódio:</p> {formatDate(serie.first_air_date)}
                  </div>
                </div>
                <div className="movie-detail-situacao-aux-8">
                  <div className="movie-detail-situacao">
                    <p>Último episódio:</p> {formatDate(serie.last_air_date)}
                  </div>
                </div>
                <div className="movie-detail-sinopse-aux-4">
                  <p>Sinopse:</p> {serie.overview}
                </div>
                <div className="movie-detail-orcamento-aux-5">
                  <div className="movie-detail-orcamento">
                    <p>Número de temporadas:</p> {serie.number_of_seasons}
                  </div>
                </div>
                <div className="movie-detail-bilheteria-aux-6">
                  <div className="movie-detail-bilheteria">
                    <p>Número de episódios:</p> {serie.number_of_episodes}
                  </div>
                </div>
                <div className="movie-detail-pais-aux-9">
                  <div className="movie-detail-situacao">
                    <p>Situação:</p> {getTranslatedStatus(serie.status)}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <p>Detalhes da série não disponíveis.</p>
        )}
      </ul>
      <section className="movie-detail-similar-container-section">
        <div className="movie-detail-similar-title-container">
          <h1>Séries similares</h1>
          <IoIosArrowForward className="homePage-iconArrow" />
        </div>
        <Suspense
          fallback={
            <div className="loading-container">
              <ReactLoading
                type="spin"
                color="#6046ff"
                height={"5%"}
                width={"5%"}
              />
            </div>
          }
        >
          <div>
            <AuxiliarScrollSerie series={similarSeries} />
          </div>
        </Suspense>
      </section>
      <section className="movie-detail-similar-container-section">
        <div className="movie-detail-similar-title-container">
          <h1>Séries recomendadas</h1>
          <IoIosArrowForward className="homePage-iconArrow" />
        </div>
        <Suspense
          fallback={
            <div className="loading-container">
              <ReactLoading
                type="spin"
                color="#6046ff"
                height={"5%"}
                width={"5%"}
              />
            </div>
          }
        >
          <div>
            <AuxiliarScrollSerie series={recomendationSeries} />
          </div>
        </Suspense>
      </section>
    </>
  );
}

export default function SerieDetail() {
  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <ReactLoading
            type="spin"
            color="#6046ff"
            height={"5%"}
            width={"5%"}
          />
        </div>
      }
    >
      <SerieDetailContent />
    </Suspense>
  );
}
