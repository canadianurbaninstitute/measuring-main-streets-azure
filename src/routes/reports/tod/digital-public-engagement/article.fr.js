export const sections = [
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'welcome'
			}
		],
		blocks: [
			{
				panelId: 'welcome',
				heading: 'Que signifie « aimer son quartier »?',
				body: `<p><em>Love Your Neighbourhood</em> est une initiative de consultation publique numérique élaborée par Digital Public Square dans le cadre du projet de l’Initiative de recherche et de connaissances (IRC), dirigé par l’Institut urbain du Canada et financé par Logement, Infrastructures et Collectivités Canada. La plateforme numérique a été conçue pour donner aux membres de la collectivité voix au chapitre dans l’établissement des priorités de leur quartier, tout en les informant sur la densification résidentielle, l’aménagement axé sur le transport collectif et les collectivités complètes. </p>
				<p>Le projet visait à faire connaître ce que les collectivités complètes peuvent offrir, à recueillir l’opinion des personnes résidentes sur les priorités locales et à donner aux gens les moyens de défendre les changements qu’ils souhaitent voir.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'persona'
			}
		],
		blocks: [
			{
				panelId: 'persona',
				heading: 'Qu’est-ce que la recherche sur les personas?',
				body: `<p>La <em>recherche sur les personas</em> consiste à recueillir des données sur un groupe d’intérêt précis afin de créer des profils de personnes concis, mais fictifs. Couramment utilisés en marketing et en technologie, les personas aident les équipes à mieux se mettre à la place du groupe visé, à s’entendre sur les objectifs et à prendre des décisions fondées sur des données probantes. </p>
				<p>Dans le cadre de <em>Love Your Neighbourhood</em>, les personas ont servi à orienter la conception de l’outil de consultation communautaire. En recueillant des données agrégées sur les gens et en les analysant pour dégager des tendances ou des thèmes intéressants, on peut créer différents archétypes de participants aux conversations pour chaque collectivité.
                Ces archétypes permettent ensuite de concevoir de façon plus rationnelle un outil avec lequel les personnes résidant à Kitsilano, à Northfield et à Cooksville peuvent interagir de manière productive.</p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'creatingpersonas'
			}
		],
		blocks: [
			{
				panelId: 'creatingpersonas',
				heading: 'Comment Digital Public Square a créé ses personas',
				body: `<p>Des conversations sur les médias sociaux ont été recueillies dans les communautés en ligne fréquentées dans chacun des trois
                secteurs faisant l’objet d’une étude de cas, afin de créer des personas de résidents et de mieux comprendre les publics que nous souhaitions joindre.
                Des publications, des commentaires et des conversations publiques ont été recueillis sur Reddit, Facebook, Instagram, X, Bluesky, LinkedIn, des blogues et d’autres forums. </p>
				<p>Ces données textuelles ont ensuite été analysées par des modèles de traitement automatique du langage naturel, qui ont fait ressortir des sujets, des conflits et le sentiment général. Les données Opticks d’Environics Analytics
                ont ajouté un contexte supplémentaire sur le plan démographique et du comportement en ligne. </p>`
			}
		]
	},
	{
		layout: 'scrolly',
		panels: [
			{
				id: 'design'
			}
		],
		blocks: [
			{
				panelId: 'design',
				heading: 'Concevoir l’outil',
				body: `<p><em>Love Your Neighbourhood</em> offre une expérience en ligne où les gens peuvent découvrir comment leur quartier évolue et donner leur point de vue sur ce qu’ils valorisent dans ces changements. L’outil utilise des questions interactives pour faire ressortir la façon dont les personnes résidentes envisagent les compromis et les priorités, et permet d’explorer les sujets plus ou moins en profondeur selon l’intérêt de chacun.</p>
				<p>L’expérience présente des thèmes liés à l’aménagement axé sur le transport collectif, aux collectivités complètes et à l’évolution des quartiers — comme le logement, la mobilité et l’espace public — et permet aux utilisateurs de réfléchir à différents avenirs possibles et de les comparer. Elle favorise l’expression de préférences, de compromis et d’idées sur ce que les gens aimeraient voir dans leur collectivité.</p>`
			}
		]
	}
];
