import { useEffect, useState } from "react";
import { PageContainer } from "../../components/ui/page-content";
import { Heading } from "../../components/ui/heading";
import { useLanguage } from "../../i18n/LanguageContext";
import { getCountryNames } from "../../api/countrydle/countries.api";
import { sendCountryGuess } from "../../api/countrydle/dailycountrygame.api";
import type { CountryGuessResponse, CountryName } from "../../api/type.api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

function CountrydlePage() {
	const { t } = useLanguage();
	const [inputValue, setInputValue] = useState('');
	const [countryNames, setCountryNames] = useState<CountryName[]>([]);
	const [guesses, setGuesses] = useState<CountryGuessResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadCountries() {
			try {
				setIsLoading(true);
				const names = await getCountryNames();
				setCountryNames(names);
				setError(null);
			} catch {
				setError("Impossible de charger les pays.");
			} finally {
				setIsLoading(false);
			}
		}

		loadCountries();
	}, []);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const validCountry = countryNames.find(
			(country) => country.name.toLowerCase() === inputValue.trim().toLowerCase()
		);

		if (!validCountry) {
			alert("Ce pays n'existe pas !");
			return;
		}

		if (guesses.some((guess) => guess.name.toLowerCase() === validCountry.name.toLowerCase())) {
			return;
		}

		try {
			const result = await sendCountryGuess(validCountry.name);
			setGuesses([result, ...guesses]);
			setInputValue('');
		} catch {
			alert("Erreur pendant l'essai");
		}
	};

	if (isLoading) {
		return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
	}

	return (
		<PageContainer>
			<Heading>{t("countrydle.title")}</Heading>
			<p>{t("countrydle.subtitle")}</p>

			{error && <div className="error-alert">{error}</div>}

			<form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
				<Input
					type="text"
					placeholder="Entrez un nom de pays..."
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
				/>
				<Button type="submit">
					Valider
				</Button>
			</form>

			<div className="mt-8 flex flex-col gap-3 w-full max-w-md">
				{guesses.map((guess, index) => (
					<div key={`${guess.name}-${index}`} className="bg-white/5 border border-white/10 rounded-lg p-4">
						<div className="flex items-center gap-3 mb-3">
							<img src={guess.flagUrl} alt={guess.name} className="w-10 h-7 object-cover" />
							<strong>{guess.name}</strong>
						</div>

						<p>Continent: {guess.continent.value} ({guess.continent.status})</p>
						<p>Region: {guess.region.value} ({guess.region.status})</p>
						<p>Language: {guess.language.value} ({guess.language.status})</p>
					</div>
				))}
			</div>
		</PageContainer>
	);
}

export default CountrydlePage;
