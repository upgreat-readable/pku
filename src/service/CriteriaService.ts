//@ts-ignore
import CriterionFabric from '@upgreat-readable/criteria';

/**
 * Сервис расчета критериев
 */
class CriteriaService {
    protected readyObject: object;

    /**
     * Объект эссе в заданном виде
     * @param essay
     */
    constructor(essay: object) {
        this.readyObject = new CriterionFabric(essay).run();
    }

    public getResult(): string {
        return JSON.stringify(this.readyObject, null, 2);
    }

    public getResultObject() {
        return this.readyObject;
    }
}

export default CriteriaService;
