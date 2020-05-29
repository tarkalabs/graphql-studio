'use strict';

import { CoreUtils } from "./erd-core-utils"
import * as models from "./erd-vuerd-models";

export const ERD_FILE_EXTENSION = "vuerd.json";

/**
 * Vuerd Utility implementations
 * VuerdUtils extends CoreUtils and simply allows
 * the data to be instantiated to the Vuerd types
 * rather than being a Partial abstract implementation
 *
 * Main responsibility is to instantiate data to the correct types
 * to facillitate stringification in the final steps
 */
export class VuerdUtils extends CoreUtils {
    public newTable(row, model): models.VuerdTable {
        return new models.VuerdTable(super.newTable(row, model));
    }

    public newColumn(row, model): models.VuerdColumn {
        return new models.VuerdColumn(super.newColumn(row, model));
    }

    public newRelationship(row, model): models.VuerdRelationship {
        let relationship = super.newRelationship(row, model);
        if (relationship) {
            model.relationships[model.relationshipIndex[relationship.startId]] = new models.VuerdRelationship(relationship);
            return model.relationships[model.relationshipIndex[relationship.startId]];
        } else {
            return null;
        }
    }
}