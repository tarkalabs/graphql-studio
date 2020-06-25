'use strict';

import { CoreUtils } from "./erd-core-utils"
import * as models from "./erd-mermaid-models";

export const ERD_FILE_EXTENSION = "mmd";

/**
 * Mermaid Utility implementations
 * MermaidUtils extends CoreUtils and simply allows
 * the data to be instantiated to the Mermaid types
 * rather than being a Partial abstract implementation
 *
 * Main responsibility is to instantiate data to the correct types
 * to facillitate stringification in the final steps
 */
export class MermaidUtils extends CoreUtils {
    public newTable(row, model): models.MermaidTable {
        return new models.MermaidTable(super.newTable(row, model));
    }

    public newColumn(row, model): models.MermaidColumn {
        return new models.MermaidColumn(super.newColumn(row, model));
    }

    public newRelationship(row, model): models.MermaidRelationship {
        let relationship = super.newRelationship(row, model);
        if (relationship) {
            model.relationships[model.relationshipIndex[relationship.startId]] = new models.MermaidRelationship(relationship);
            return model.relationships[model.relationshipIndex[relationship.startId]];
        } else {
            return null;
        }
    }
}