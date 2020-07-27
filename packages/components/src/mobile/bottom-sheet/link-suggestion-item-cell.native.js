/**
 * External dependencies
 */
import { Text, View, StyleSheet } from 'react-native';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { globe } from '@wordpress/icons';
import { usePreferredColorSchemeStyle } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Cell from './cell';
import cellStyles from './styles.scss';
import suggestionStyles from './link-suggestion-styles.scss';
import { posts, pages, empty } from '../gridicons';

const { compose } = StyleSheet;

const icons = {
	URL: globe,
	post: posts,
	page: pages,
};

// we use some Cell styles here with a column flex-direction
function LinkSuggestionItemCell( { suggestion, onLinkPicked } ) {
	const { title: contentTitle, url, type, isDirectEntry } = suggestion;
	const title = isDirectEntry ? url : contentTitle;
	const summary = isDirectEntry ? __( 'Add this link' ) : url;

	const pickLink = () => onLinkPicked( suggestion );

	const cellTitleStyle = usePreferredColorSchemeStyle(
		cellStyles.cellLabel,
		cellStyles.cellTextDark
	);

	const cellSummaryStyle = usePreferredColorSchemeStyle(
		cellStyles.cellValue,
		cellStyles.cellTextDark
	);

	const titleStyle = compose( cellTitleStyle, suggestionStyles.titleStyle );
	const summaryStyle = compose(
		cellSummaryStyle,
		suggestionStyles.summaryStyle
	);

	return (
		<Cell
			icon={ icons[ type ] || empty }
			onPress={ pickLink }
			separatorType={ 'none' }
			cellContainerStyle={ suggestionStyles.itemContainerStyle }
			labelStyle={ suggestionStyles.hidden }
			valueStyle={ suggestionStyles.hidden }
		>
			<View style={ suggestionStyles.containerStyle }>
				<Text
					style={ titleStyle }
					numberOfLines={ 1 }
					ellipsizeMode={ 'middle' }
				>
					{ title }
				</Text>
				<Text
					style={ summaryStyle }
					numberOfLines={ 1 }
					ellipsizeMode={ 'middle' }
				>
					{ summary }
				</Text>
			</View>
		</Cell>
	);
}

export default LinkSuggestionItemCell;