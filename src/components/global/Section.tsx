import {ReactNode} from 'react';

type SectionProps = {
	children: ReactNode;
	sectionClass?: string;
	containerClass?: string;
	rowClass?: string;
};

const Section = ({children, sectionClass = '', containerClass = '', rowClass = ''}: SectionProps) => {
	return (
		<section className={sectionClass}>
			<div className={['container', containerClass].filter(Boolean).join(' ')}>
				<div className={['row', rowClass].filter(Boolean).join(' ')}>
					{children}
				</div>
			</div>
		</section>
	)
		;
};

export default Section;